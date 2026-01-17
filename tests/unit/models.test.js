import { jest } from "@jest/globals";
import { Task, PriorityTask, User } from "./../../script/models.js";

// Task, PriorityTaks and User classes
describe("Models: Task, PriorityTask, User", () => {
  // Task Class
  describe("Task", () => {
    let task;

    beforeEach(() => {
      task = new Task({
        id: 1,
        title: "Write unit tests",
        completed: false,
        userId: 101,
      });
    });

    describe("constructor()", () => {
      test("initializes all provided properties correctly", () => {
        expect(task.id).toBe(1);
        expect(task.title).toBe("Write unit tests");
        expect(task.completed).toBe(false);
        expect(task.userId).toBe(101);
      });

      test("allows missing optional properties (remain undefined)", () => {
        const t = new Task({ id: 2 });
        expect(t.id).toBe(2);
        expect(t.title).toBeUndefined();
        expect(t.completed).toBeUndefined();
        expect(t.userId).toBeUndefined();
      });

      test("accepts various types without throwing (no validation in model)", () => {
        expect(
          () =>
            new Task({ id: "x", title: 123, completed: "yes", userId: null })
        ).not.toThrow();
      });

      test("edge case: empty object produces undefined fields", () => {
        const t = new Task({});
        expect(t.id).toBeUndefined();
        expect(t.title).toBeUndefined();
        expect(t.completed).toBeUndefined();
        expect(t.userId).toBeUndefined();
      });
    });

    describe("toggle()", () => {
      test("flips completed from false -> true", () => {
        task.toggle();
        expect(task.completed).toBe(true);
      });

      test("flips completed from true -> false", () => {
        task.completed = true;
        task.toggle();
        expect(task.completed).toBe(false);
      });
    });

    describe("getStatus()", () => {
      test('returns "Pending" when not completed', () => {
        expect(task.getStatus()).toBe("Pending");
      });

      test('returns "Completed" when completed', () => {
        task.completed = true;
        expect(task.getStatus()).toBe("Completed");
      });
    });

    describe("isOverDue()", () => {
      test("always returns false (per current implementation)", () => {
        expect(task.isOverDue()).toBe(false);
        task.completed = true;
        expect(task.isOverDue()).toBe(false);
      });
    });

    // Additional resilience tests
    describe("resilience & invalid input handling (non-throwing behavior)", () => {
      test("null values are stored as-is", () => {
        const t = new Task({
          id: null,
          title: null,
          completed: null,
          userId: null,
        });
        expect(t.id).toBeNull();
        expect(t.title).toBeNull();
        expect(t.completed).toBeNull();
        expect(t.userId).toBeNull();
      });

      test("undefined properties remain undefined", () => {
        const task = new Task({
          id: 5,
          title: undefined,
          completed: undefined,
          userId: undefined,
        });
        expect(task.id).toBe(5);
        expect(task.title).toBeUndefined();
        expect(task.completed).toBeUndefined();
        expect(task.userId).toBeUndefined();
      });
    });
  });
});
``;
