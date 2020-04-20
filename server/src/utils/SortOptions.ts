import { SortOrder } from "../data/enums/SortOrder";

export interface SortOptions<T> {
  by: T;
  order: SortOrder;
}

export interface ISortArgs<T> {
  sortBy: T;
  order: SortOrder;
}

export function argsToSortOptions<T>(args: ISortArgs<T>): {} | { sort: SortOptions<NonNullable<T>>; } {
  if (!args.sortBy) {
    return {};
  }

  return {
    sort: {
      by: args.sortBy,
      order: args.order
    }
  };
}
