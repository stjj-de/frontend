import {
  Arg,
  Args, ArgsType,
  Field, FieldResolver, ID, InputType, Mutation,
  Query,
  Resolver, ResolverInterface, Root
} from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Inject } from "typedi";
import { ApolloError } from "apollo-server-koa";
import { Event, EventColor } from "../models/Event";
import { PaginationArgs } from "../utils/PaginationArgs";
import { SortOrder } from "../enums/SortOrder";
import { EventSortField } from "../enums/EventSortField";
import { EventController } from "../../controllers/EventController";
import { argsToSortOptions, ISortArgs } from "../../utils/SortOptions";
import { EventsPagination } from "../objectTypes/EventsPagination";
import { User } from "../models/User";
import { Post } from "../models/Post";

@ArgsType()
class GetEventsArgs extends PaginationArgs implements ISortArgs<EventSortField | null> {
  @Field(() => SortOrder, { defaultValue: SortOrder.ASCENDING })
  order: SortOrder;

  @Field(() => EventSortField, { nullable: true })
  sortBy: EventSortField | null;

  @Field(() => String, { nullable: true, description: "Filter by day or month. Format: yyyy-mm or yyyy-mm-dd." })
  filter: string | null;
}

@InputType()
class CreateAndUpdateEventInput {
  @Field() title: string;

  @Field() date: Date;

  @Field(() => Date, { nullable: true }) endDate: Date | null;

  @Field(() => EventColor, { defaultValue: EventColor.GRAY }) color: EventColor;

  @Field({ defaultValue: "" }) description: string;

  @Field(() => ID, { nullable: true }) relatedPostId: string | null;
}

@Resolver(() => Event)
export class EventResolver implements ResolverInterface<Event> {
  @InjectRepository(Event) private readonly eventRepository: Repository<Event>;
  @InjectRepository(Post) private readonly postRepository: Repository<Post>;

  @Inject(() => EventController) private readonly eventController: EventController;

  @Query(() => EventsPagination)
  async events(@Args() args: GetEventsArgs): Promise<EventsPagination> {
    const { hasMore, events } = await this.eventController.getEvents({
      filter: args.filter ?? undefined,
      skip: args.skip,
      take: args.take ?? undefined,
      ...argsToSortOptions(args)
    });

    return {
      hasMore,
      items: events
    };
  }

  @Query(() => Event)
  event(@Arg("id", () => ID) id: string) {
    return this.eventRepository.findOne(id);
  }

  @Mutation(() => Event)
  async updateEvent(@Arg("id") id: string, @Arg("event") data: CreateAndUpdateEventInput): Promise<Event> {
    // TODO: Only allow editing of own events for normal users
    const event = await this.eventRepository.findOne(id);

    if (event === undefined) {
      throw new ApolloError("There is no event with the specified ID.");
    }

    Object.assign(event, data);

    if (data.relatedPostId !== null) {
      const relatedPost = await this.postRepository.findOne(data.relatedPostId);

      if (relatedPost === undefined) {
        throw new ApolloError("There is no post with the specified ID.");
      } else {
        event.relatedPost = relatedPost;
      }
    }

    return this.eventRepository.save(event);
  }

  @FieldResolver()
  async relatedPost(@Root() event: Event) {
    return (await this.eventRepository.findOne(event.id, { relations: ["relatedPost"] }))!.relatedPost;
  }
}
