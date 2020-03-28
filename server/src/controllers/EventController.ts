import { InjectRepository } from "typeorm-typedi-extensions";
import { FindManyOptions, Raw, Repository } from "typeorm";
import { endOfDay, startOfDay, parseISO, startOfMonth, endOfMonth } from "date-fns";
import { Event } from "../data/models/Event";
import { EventSortField } from "../data/enums/EventSortField";
import { SortOptions } from "../utils/SortOptions";
import { EventsPagination } from "../data/objectTypes/EventsPagination";

export interface GetEventsOptions {
  skip?: number;
  take?: number;
  sort?: SortOptions<EventSortField>;
  filter?: string;
}

export class EventController {
  @InjectRepository(Event) private readonly eventRepository: Repository<Event>;

  async getEvents(options: GetEventsOptions) {
    const order: FindManyOptions<Event>["order"] = {};
    switch (options.sort?.by) {
      case EventSortField.TITLE: order.title = options.sort.order; break;
      case EventSortField.COLOR: order.color = options.sort.order; break;
      case EventSortField.DATE: order.date = options.sort.order; break;
      case EventSortField.END_DATE: order.endDate = options.sort.order; break;
    }

    const where: FindManyOptions<Event>["where"] = {};
    if (options.filter) {
      const partsCount = options.filter.split("-").length;

      const filterDate = parseISO(options.filter);
      let startDate: Date;
      let endDate: Date;

      if (partsCount === 2) {
        // filter by month
        startDate = startOfMonth(filterDate);
        endDate = endOfMonth(filterDate);
      } else if (partsCount === 3) {
        // filter by day
        startDate = startOfDay(filterDate);
        endDate = endOfDay(startDate);
      } else {
        throw new Error("Invalid filter string. Required format: yyyy-mm or yyyy-mm-dd");
      }

      where.date = Raw(alias => `${alias} >= '${startDate.toISOString()}' AND ${alias} <= '${endDate.toISOString()}'`);
    }

    const events = await this.eventRepository.find({
      skip: options.skip,
      take: options.take === undefined ? undefined : options.take + 1,
      order,
      where
    });

    const hasMore = options.take === undefined ? false : events.length === options.take + 1;

    return {
      events: events.slice(0, -1),
      hasMore
    };
  }
}
