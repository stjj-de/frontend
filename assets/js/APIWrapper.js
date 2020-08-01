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
    this.groups = new GroupsAPIModelEndpointWrapper(axios, "groups");

    this.contents = {
      get: id => axios.$get(`/api/contents/${id}`),
      update: (id, content) => axios.$put(`/api/contents/${id}`, content)
    }
  }
}

class APIModelEndpointWrapper {
  constructor(axios, name) {
    this.axios = axios;
    this.name = name;
  }

  async create(data, allowedStatuses = [201]) {
    return (await this.axios.$post(`/api/${this.name}`, data, { validateStatus: status => allowedStatuses.includes(status) }));
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
    limit = 50,
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
    const mapper = async item => {
      const value = item[fieldName]
      let result;
      if (value === null) {
        result = null;
      } else if (Array.isArray(value)) {
        result = await Promise.all(value.map(id => this.get(id, fields)));
      } else {
        result = await this.get(value, fields);
      }

      return {
        ...item,
        [fieldName]: result
      }
    };

    if(obj.items !== undefined) {
      return {
        ...obj,
        items: await Promise.all(obj.items.map(mapper))
      };
    } else {
      return Array.isArray(obj) ? await Promise.all(obj.map(mapper)) : await mapper(obj);
    }
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
    group = undefined,
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
      onlyRelevant,
      group
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

class GroupsAPIModelEndpointWrapper extends APIModelEndpointWrapper {
  constructor(axios) {
    super(axios, "groups");
  }

  list({
         fields = undefined,
         limit = 10,
         offset = 0,
         sortBy = undefined,
         ascending = true,
         onlyOwn = false
       }) {
    const query = querystring.stringify({
      fields: fields === undefined ? undefined : fields.join(","),
      limit,
      offset,
      sortBy,
      asc: sortBy === undefined ? undefined : ascending,
      onlyOwn
    })

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

[].flat() // To include polyfill

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
