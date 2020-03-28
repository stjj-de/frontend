import {
  Args, ArgsType,
  Field, FieldResolver,
  Query,
  Resolver, ResolverInterface, Root
} from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Inject } from "typedi";
import { Event } from "../models/Event";
import { PaginationArgs } from "../utils/PaginationArgs";
import { SortOrder } from "../enums/SortOrder";
import { EventSortField } from "../enums/EventSortField";
import { EventController } from "../../controllers/EventController";
import { argsToSortOptions, ISortArgs } from "../../utils/SortOptions";
import { EventsPagination } from "../objectTypes/EventsPagination";

@ArgsType()
class GetEventsArgs extends PaginationArgs implements ISortArgs<EventSortField | null> {
  @Field(() => SortOrder, { defaultValue: SortOrder.ASCENDING })
  order: SortOrder;

  @Field(() => EventSortField, { nullable: true })
  sortBy: EventSortField | null;

  @Field(() => String, { nullable: true, description: "Filter by day or month. Format: yyyy-mm or yyyy-mm-dd." })
  filter: string | null;
}

@Resolver(() => Event)
export class EventResolver implements ResolverInterface<Event> {
  @InjectRepository(Event) private readonly eventRepository: Repository<Event>;

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

  @FieldResolver()
  async relatedPost(@Root() event: Event) {
    return (await this.eventRepository.findOne(event.id, { relations: ["relatedPost"] }))!.relatedPost;
  }

  @FieldResolver()
  async creators(@Root() event: Event) {
    return (await this.eventRepository.findOne(event.id, { relations: ["creators"] }))!.creators;
  }
}
