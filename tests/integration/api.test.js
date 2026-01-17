// Integration tests for APIClient (api.js)

// Requirements:
//10 integration test cases
//mock global fetch
//mockResolvedValue / mockRejectedValue
//verify API endpoints
//test success + failure
//test caching behavior
//verify logging side effects

import { jest } from "@jest/globals";
import { APIClient } from "../../script/api.js";

global.fetch = jest.fn();

describe("API Integration – APIClient", () => {
  let api;
  let consoleErrorSpy;

  beforeEach(() => {
    api = new APIClient("https://example.com");
    fetch.mockClear();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  // fetchUser()
  test("fetchUser() calls the correct /users endpoint", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ id: 1, name: "John" }]),
    });

    const result = await api.fetchUser();

    expect(fetch).toHaveBeenCalledWith("https://example.com/users");
    expect(result).toEqual([{ id: 1, name: "John" }]);
  });

  test("fetchUser() throws error when response.ok = false", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(api.fetchUser()).rejects.toThrow(
      "Failed to fetch /users: 500"
    );
  });

  // fetchTodos()
  test("fetchTodos() calls the correct /todos endpoint", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ id: 1, title: "A task" }]),
    });

    const result = await api.fetchTodos();

    expect(fetch).toHaveBeenCalledWith("https://example.com/todos");
    expect(result.length).toBe(1);
  });

  test("fetchTodos() throws error on 404", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });

    await expect(api.fetchTodos()).rejects.toThrow(
      "Failed to fetch /todos: 404"
    );
  });

  // fetchUserTodos()
  test("fetchUserTodos(id) calls /todos?userId={id}", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ id: 99, userId: 3, completed: false }]),
    });

    const result = await api.fetchUserTodos(3);

    expect(fetch).toHaveBeenCalledWith("https://example.com/todos?userId=3");
    expect(result[0].userId).toBe(3);
  });

  test("fetchUserTodos() logs error and returns [] when network fails", async () => {
    fetch.mockRejectedValueOnce(new Error("Network fail"));

    const result = await api.fetchUserTodos(3);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Network fail");
    expect(result).toEqual([]); // API returns [] on failure
  });

  test("fetchUserTodos() logs error and returns [] for non-OK HTTP", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const result = await api.fetchUserTodos(3);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  // CachedData() – Cache Behavior Tests
  test("CachedData() stores API response in cache", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ id: 1 }]),
    });

    const data1 = await api.CachedData("/users");
    const data2 = await api.CachedData("/users"); // should come from cache

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(data1).toEqual(data2);
  });

  test("CachedData() throws when response is not OK", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    await expect(api.CachedData("/users")).rejects.toThrow(
      "Failed to fetch /users: 400"
    );
  });

  // Response parsing tests
  test("fetchUser() parses JSON correctly", async () => {
    const mockUserData = [{ id: 10, name: "Alice" }];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUserData),
    });

    const result = await api.fetchUser();
    expect(result[0].name).toBe("Alice");
  });

  test("fetchTodos() parses JSON correctly", async () => {
    const mockTodo = [{ id: 99, title: "Task X" }];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTodo),
    });

    const result = await api.fetchTodos();
    expect(result[0].id).toBe(99);
    expect(result[0].title).toBe("Task X");
  });

  // Additional robustness checks
  test("APIClient stores baseURL correctly", () => {
    expect(api.baseURL).toBe("https://example.com");
  });

  test("fetchUserTodos() gracefully handles empty JSON array", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    const result = await api.fetchUserTodos(1);

    expect(result).toEqual([]);
  });
});
