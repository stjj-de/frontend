import { InjectRepository } from "typeorm-typedi-extensions";
import { FindManyOptions, Raw, Repository } from "typeorm";
import { endOfDay, startOfDay, parseISO, startOfMonth, endOfMonth } from "date-fns";
import { Event } from "../data/models/Event";
import { EventSortField } from "../data/enums/EventSortField";
import { SortOptions } from "../utils/SortOptions";

export interface GetEventsOptions {
  skip?: number;
  take?: number;
  sort?: SortOptions<EventSortField>;
  filter?: string;
}

const createInvalidFormatError = () => new Error("Invalid filter string. Required format: yyyy-mm, yyyy-mm-dd or yyyy-mm-dd:yyyy-mm-dd.");

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
      const dates = options.filter.split(":");

      let startDate: Date;
      let endDate: Date;

      if (dates.length === 2) {
        if (dates.some(date => date.split("-").length !== 3)) {
          throw createInvalidFormatError();
        }

        startDate = startOfDay(parseISO(dates[0]));
        endDate = endOfDay(parseISO(dates[1]));
      } else if (dates.length === 1) {
        const partsCount = options.filter.split("-").length;

        const filterDate = parseISO(options.filter);

        if (partsCount === 2) {
          // filter by month
          startDate = startOfMonth(filterDate);
          endDate = endOfMonth(filterDate);
        } else if (partsCount === 3) {
          // filter by day
          startDate = startOfDay(filterDate);
          endDate = endOfDay(startDate);
        } else {
          throw createInvalidFormatError();
        }
      } else {
        throw createInvalidFormatError();
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
      events: hasMore ? events.slice(0, -1) : events,
      hasMore
    };
  }
}
