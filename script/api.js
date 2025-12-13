const BASE_URL = "https://jsonplaceholder.typicode.com";

export class APIClient {
  constructor(baseURL = BASE_URL) {
    this.baseURL = baseURL;
  }

  async fetchUser() {
    const url = `${this.baseURL}/users`;
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to fetch user: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("FetchUsers error", error.message);
      throw error;
    }
  }

  async fetchTodos() {
    try {
      const response = await fetch(`${this.baseURL}/todos`);
      if (!response.ok)
        throw new Error(`Failed to fetch todos: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("FetchTodos error", error.message);
      throw error;
    }
  }

  async fetchUserTodos(userID) {
    const url = `${this.baseURL}/todos/${userID}`;
    try {
      const response = await fetch(`${this.baseURL}/todos/${url}`);
      if (!response.ok)
        throw new Error(`Failed to fetch todos: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("FetchTodos error", error.message);
      throw error;
    }
  }
}
