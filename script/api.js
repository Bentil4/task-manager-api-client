import { BASE_API_URL } from "../config.js";
const BASE_URL = BASE_API_URL;

export class APIClient {
  constructor(baseURL = BASE_URL) {
    this.baseURL = baseURL;
    this.cache = new Map();
  }

  async CachedData(endpoint) {
    if (this.cache.has(endpoint)) {
      return this.cache.get(endpoint);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      if (!response.ok)
        throw new Error(`Failed to fetch user: ${response.status}`);

      const data = await response.json();
      this.cache.set(endpoint, data);
      return data;
    } catch (error) {
      console.error(endpoint.message);
      return [];
    }
  }

  async fetchUser() {
    return this.CachedData("/users");
  }

  async fetchTodos() {
    return this.CachedData("/todos");
  }

  fetchUserTodos(userId) {
    const url = `${this.baseURL}todos?userId=${userId}}`;

    return fetch(`${this.baseURL}/todos?userId=${userId}`)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to fetch user todos`);
        return response.json();
      })
      .catch((error) => {
        console.error(error.message);
        return [];
      });
  }
}
