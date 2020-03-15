import {
  Arg, FieldResolver, Int,
  Query,
  Resolver,
  ResolverInterface, Root
} from "type-graphql";
import { Raw, Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { lastDayOfMonth, startOfDay, endOfDay } from "date-fns";
import { Event } from "../models/Event";

@Resolver(() => Event)
export class EventResolver implements ResolverInterface<Event> {
  @InjectRepository(Event) private readonly eventRepository: Repository<Event>;

  @Query(() => [Event])
  eventsInMonth(@Arg("month", () => Int) month: number, @Arg("year", () => Int) year: number) {
    const startDate = new Date(`${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-01T00:00:00Z`);
    const endDate = lastDayOfMonth(startDate);

    return this.eventRepository.find({
      where: {
        date: Raw(alias => `${alias} >= '${startDate.toISOString()}' AND ${alias} <= '${endDate.toISOString()}'`)
      }
    });
  }

  @Query(() => [Event])
  eventsOnDay(@Arg("date") date: string) {
    const startDate = startOfDay(new Date(date));
    const endDate = endOfDay(startDate);

    return this.eventRepository.find({
      where: {
        date: Raw(alias => `${alias} >= '${startDate.toISOString()}' AND ${alias} <= '${endDate.toISOString()}'`)
      }
    });
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
