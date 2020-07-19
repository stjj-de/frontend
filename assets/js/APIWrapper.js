import querystring from "query-string";

export class APIWrapper {
  constructor(axios) {
    this.posts = new PostsAPIModelEndpointWrapper(axios);
    this.events = new EventsAPIModelEndpointWrapper(axios);
    this.users = new APIModelEndpointWrapper(axios, "users");
    this.videos = new VideosAPIModelEndpointWrapper(axios);
    this.churches = new APIModelEndpointWrapper(axios, "churches");
    this.churchServiceDates = new APIModelEndpointWrapper(axios, "church-service-dates");
    this.uploadedFields = new APIModelEndpointWrapper(axios, "uploaded-files");

    this.contents = {
      get(id) {
        return axios.$get(`/api/contents/${id}`);
      }
    }
  }
}

class APIModelEndpointWrapper {
  constructor(axios, name) {
    this.axios = axios;
    this.name = name;
  }

  async create(data, allowedStatuses = [201]) {
    return (await this.axios.$post(`/api/${this.name}`, data, { validateStatus: status => allowedStatuses.includes(status) })).data;
  }

  update(id, data) {
    return this.axios.$put(`/api/${this.name}/${id}`, data);
  }

  delete(id) {
    return this.axios.$delete(`/api/${this.name}/${id}`);
  }

  async get(id, fields = undefined) {
    const query = querystring.stringify({ fields: fields === undefined ? undefined : fields.join(",") })
    return (await this.axios.$get(`/api/${this.name}/${id}?${query}`, { validateStatus: status => [200, 404].includes(status) })).data;
  }

  list({
    fields = undefined,
    limit = 10,
    offset = 0,
    sortBy = undefined,
    ascending = true
  }) {
    const query = querystring.stringify({
      fields: fields === undefined ? undefined : fields.join(","),
      limit,
      offset,
      sortBy,
      asc: sortBy === undefined ? undefined : ascending
    })

    return this.axios.$get(`/api/${this.name}?${query}`);
  }

  async populate(obj, fieldName, fields = undefined) {
    const mapper = async item => ({
      ...item,
      [fieldName]: item[fieldName] === null ? null : await this.get(item[fieldName], fields)
    });

    return Array.isArray(obj) ? await Promise.all(obj.map(mapper)) : await mapper(obj);
  }
}

class PostsAPIModelEndpointWrapper extends APIModelEndpointWrapper {
  constructor(axios) {
    super(axios, "posts");
  }

  list({
    fields = undefined,
    limit = 10,
    offset = 0,
    onlyRelevant = true,
    onlyPublished = true,
    sortBy = undefined,
    ascending = true
  }) {
    const query = querystring.stringify({
      fields: fields === undefined ? undefined : fields.join(","),
      limit,
      offset,
      sortBy,
      asc: sortBy === undefined ? undefined : ascending,
      onlyPublished,
      onlyRelevant
    });

    return this.axios.$get(`/api/${this.name}?${query}`);
  }
}

class VideosAPIModelEndpointWrapper extends APIModelEndpointWrapper {
  constructor(axios) {
    super(axios, "videos");
  }

  list({
    fields = undefined,
    limit = 10,
    offset = 0,
    onlyPublished = true,
    sortBy = undefined,
    ascending = true
  }) {
    const query = querystring.stringify({
      fields: fields === undefined ? undefined : fields.join(","),
      limit,
      offset,
      sortBy,
      asc: sortBy === undefined ? undefined : ascending,
      onlyPublished
    });

    return this.axios.$get(`/api/${this.name}?${query}`);
  }
}

class EventsAPIModelEndpointWrapper extends APIModelEndpointWrapper {
  constructor(axios) {
    super(axios, "events");
  }

  list({
    fields = undefined,
    limit = 10,
    offset = 0,
    sortBy = undefined,
    ascending = true,
    filter = undefined
  }) {
    const query = querystring.stringify({
      fields: fields === undefined ? undefined : fields.join(","),
      limit,
      offset,
      sortBy,
      asc: sortBy === undefined ? undefined : ascending,
      filter
    })

    return this.axios.$get(`/api/${this.name}?${query}`);
  }
}

export function combineFieldSets(...fieldSets) {
  const fields = fieldSets.flat()
  const uniqueFields = [];
  fields.forEach(field => {
    if (!uniqueFields.includes(field)) {
      uniqueFields.push(field);
    }
  });
  return uniqueFields;
}
