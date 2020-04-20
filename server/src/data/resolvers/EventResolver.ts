import {
  Arg,
  Args, ArgsType, Authorized, Ctx,
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
import { Post } from "../models/Post";
import { AuthenticatedContext } from "../Context";
import { EmptyResponse } from "../objectTypes/EmptyResponse";
import { PaginatedEventResponse } from "../objectTypes/PaginatedEventResponse";

@ArgsType()
class GetEventsArgs extends PaginationArgs implements ISortArgs<EventSortField | null> {
  @Field(() => SortOrder, { defaultValue: SortOrder.ASCENDING })
  order: SortOrder;

  @Field(() => EventSortField, { nullable: true, defaultValue: null })
  sortBy: EventSortField | null;

  @Field(() => String, { nullable: true, description: "Filter by day (yyyy-mm-dd), month (yyyy-mm) or a day span(yyyy-mm-dd:yyyy-mm-dd)." })
  filter: string | null;
}

@InputType()
class CreateEventInput {
  @Field() title: string;

  @Field() date: Date;

  @Field(() => Date, { nullable: true, defaultValue: null }) endDate: Date | null;

  @Field(() => EventColor, { defaultValue: EventColor.GRAY }) color: EventColor;

  @Field({ defaultValue: "" }) description: string;

  @Field(() => ID, { nullable: true, defaultValue: null }) relatedPostID: string | null;
}

@InputType()
class UpdateEventInput {
  @Field(() => String, { nullable: true }) title?: string | null;

  @Field(() => Date, { nullable: true }) date?: Date | null;

  @Field(() => Date, { nullable: true }) endDate?: Date | null;

  @Field(() => EventColor, { nullable: true }) color?: EventColor | null;

  @Field(() => String, { nullable: true }) description?: string | null;

  @Field(() => ID, { nullable: true }) relatedPostID?: string | null;
}

@Resolver(() => Event)
export class EventResolver implements ResolverInterface<Event> {
  @InjectRepository(Event) private readonly eventRepository: Repository<Event>;

  @InjectRepository(Post) private readonly postRepository: Repository<Post>;

  @Inject(() => EventController) private readonly eventController: EventController;

  @Query(() => PaginatedEventResponse)
  async events(@Args() args: GetEventsArgs): Promise<PaginatedEventResponse> {
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

  @Query(() => Event, { nullable: true })
  event(@Arg("id", () => ID) id: string) {
    return this.eventRepository.findOne(id);
  }

  @Authorized()
  @Mutation(() => Event)
  async createEvent(@Arg("event") data: CreateEventInput, @Ctx() context: AuthenticatedContext): Promise<Event> {
    const event = new Event();
    event.creator = context.user;

    return this.applyDataToEventAndSave(event, data);
  }

  @Authorized()
  @Mutation(() => Event)
  async updateEvent(@Arg("id", () => ID) id: string, @Arg("event") data: UpdateEventInput): Promise<Event> {
    const event = await this.eventRepository.findOne(id);

    if (event === undefined) {
      throw new ApolloError("There is no event with the specified ID.");
    }

    return this.applyDataToEventAndSave(event, data);
  }

  @Authorized()
  @Mutation(() => EmptyResponse)
  async deleteEvent(@Arg("id", () => ID) id: string) {
    const event = await this.eventRepository.findOne(id);

    if (event === undefined) {
      throw new ApolloError("There is no event with the specified ID.");
    }

    await this.eventRepository.remove(event);
    return new EmptyResponse();
  }

  @FieldResolver()
  async relatedPost(@Root() event: Event) {
    return (await this.eventRepository.findOne(event.id, { relations: ["relatedPost"] }))!.relatedPost;
  }

  @FieldResolver()
  async creator(@Root() event: Event) {
    return (await this.eventRepository.findOne(event.id, { relations: ["creator"] }))!.creator;
  }

  private async applyDataToEventAndSave(event: Event, data: CreateEventInput | UpdateEventInput) {
    event.title = data.title ?? event.title;
    event.color = data.color ?? event.color;
    event.date = data.date ?? event.date;
    event.endDate = data.endDate === undefined ? event.endDate : data.endDate;
    event.description = data.description ?? event.description;

    if (data.relatedPostID !== undefined) {
      if (data.relatedPostID === null) {
        event.relatedPost = null;
      } else {
        const relatedPost = await this.postRepository.findOne(data.relatedPostID);

        if (relatedPost === undefined) {
          throw new ApolloError("There is no post with the specified ID.");
        } else {
          event.relatedPost = relatedPost;
        }
      }
    }

    return this.eventRepository.save(event);
  }
}
