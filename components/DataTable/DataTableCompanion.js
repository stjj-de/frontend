import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";

export class DataTableCompanion {
  constructor({
    columns,
    specialKeys = {
      id: "id",
      selected: "_selected"
    },
    itemsPerPage = 10,
    sortBy,
    sortOrder = "DESCENDING",
    fetch,
    fetchDebounceTimeout = 500,
    userDefinedVariables = []
  }) {
    this._columns = columns;
    this._pageIndex = 0;
    this._items = [];
    this._loading = true;
    this._hasNextPage = false;

    this.specialKeys = specialKeys;
    this.itemsPerPage = itemsPerPage;
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    this.fetchFn = fetch;
    this.tableBodyInstance = null;
    this.bodyWidth = "100%";
    this.userDefinedVariables = userDefinedVariables;

    this._lastFetchVariables = [];

    this._fetchPage = debounce(async () => {
      const fetchVariables = this._currentFetchVariables;

      if (isEqual(fetchVariables, this._lastFetchVariables)) {
        // the variables did not change since the last fetch
        return;
      }

      this._loading = true;

      this._lastFetchVariables = fetchVariables;
      const { items, hasMore } = await this.fetchFn(...fetchVariables);

      if (!isEqual(fetchVariables, this._currentFetchVariables)) {
        // the variables changed while the fetch was running
        return;
      }

      this._items = items;
      this._hasNextPage = hasMore;

      this._loading = false;
    }, fetchDebounceTimeout, { leading: true, trailing: true });
  }

  get _currentFetchVariables() {
    return [this.pageIndex, this.sortBy, this.sortOrder, ...this.userDefinedVariables];
  }

  get lastFetchVariables() {
    return this._lastFetchVariables;
  }

  get loading() {
    return this._loading;
  }

  get hasNextPage() {
    return this._hasNextPage;
  }

  get items() {
    return this._items;
  }

  get columns() {
    return this._columns;
  }

  get pageIndex() {
    return this._pageIndex;
  }

  set pageIndex(value) {
    this._pageIndex = value;

    this._fetchPage();
  }

  initialize() {
    this._fetchPage();
  }

  updateBodyWidth() {
    this.bodyWidth = this.tableBodyInstance.getWidth() + "px";
  }

  fetch() {
    this._fetchPage();
  }
}
