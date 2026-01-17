// Integration tests for full data flow:
//  API -> processing -> Task/User model creation -> grouping -> results

// Requirements:
// 3 complete workflows
// Mock external dependencies
// Validate intermediate transformation and final outputs
// Ensure all modules interact correctly

import { jest } from "@jest/globals";
import { APIClient } from "../../script/api.js";
import { Task, User } from "../../script/models.js";
import {
  groupByUser,
  filterByStatus,
  calculateStatistics,
} from "../../script/taskProcessor.js";

global.fetch = jest.fn();

describe("Integration – Full Data Flow", () => {
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

  // WORKFLOW 1:
  // Fetch users -> Fetch todos -> Convert to models -> Group -> Assign
  test("Workflow 1: users + todos → Task instances → grouped by user", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([{ id: 1, name: "Alice", email: "a@a.com" }]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 101, title: "A", completed: false, userId: 1 },
            { id: 102, title: "B", completed: true, userId: 1 },
          ]),
      });

    const usersData = await api.fetchUser();
    const todosData = await api.fetchTodos();

    const users = usersData.map((u) => new User(u));
    const tasks = todosData.map((t) => new Task(t));

    const map = groupByUser(tasks);
    users[0].tasks = map.get(1);

    expect(users[0].tasks.length).toBe(2);
    expect(users[0].tasks[0]).toBeInstanceOf(Task);
    expect(users[0].tasks[1]).toBeInstanceOf(Task);
  });

  // WORKFLOW 2:
  // Filter completed tasks -> calculate statistics -> returned output
  test("Workflow 2: apply filters + statistics on Task models", async () => {
    // Mock fetch todos only (not users)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 201, completed: true, userId: 1 },
          { id: 202, completed: false, userId: 1 },
          { id: 203, completed: true, userId: 2 },
        ]),
    });

    const todosData = await api.fetchTodos();
    const tasks = todosData.map((t) => new Task(t));

    const completed = filterByStatus(tasks, "completed");
    const pending = filterByStatus(tasks, "pending");
    const stats = calculateStatistics(tasks);

    expect(completed.length).toBe(2);
    expect(pending.length).toBe(1);
    expect(stats).toEqual({ completed: 2, pending: 1 });
  });

  // WORKFLOW 3:
  // Multi-user distribution: multiple users, varied tasks
  test("Workflow 3: multi-user grouping + model creation + distribution", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 1, name: "User1", email: "u1@mail.com" },
            { id: 2, name: "User2", email: "u2@mail.com" },
          ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 301, userId: 1, completed: true, title: "Task1" },
            { id: 302, userId: 1, completed: false, title: "Task2" },
            { id: 303, userId: 2, completed: true, title: "Task3" },
          ]),
      });

    const usersData = await api.fetchUser();
    const todosData = await api.fetchTodos();

    const users = usersData.map((u) => new User(u));
    const tasks = todosData.map((t) => new Task(t));

    const map = groupByUser(tasks);

    users.forEach((user) => {
      user.tasks = map.get(user.id) || [];
    });

    expect(users[0].tasks.length).toBe(2);
    expect(users[1].tasks.length).toBe(1);

    expect(users[0].tasks[0]).toBeInstanceOf(Task);
    expect(users[1].tasks[0]).toBeInstanceOf(Task);

    expect(users[0].getCompletionRate()).toBe(50);
    expect(users[1].getCompletionRate()).toBe(100);
  });
});
