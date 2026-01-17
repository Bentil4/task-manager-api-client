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

  // PriorityTask Class

  describe("PriorityTask", () => {
    let baseData;

    beforeEach(() => {
      baseData = {
        id: 11,
        title: "Priority work",
        completed: false,
        userId: 202,
      };
    });

    test("inherits from Task", () => {
      const p = new PriorityTask(baseData, "high", null);
      expect(p instanceof Task).toBe(true);
    });

    test("sets priority and dueDate (explicit)", () => {
      const due = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const p = new PriorityTask(baseData, "high", due);
      expect(p.priority).toBe("high");
      expect(p.dueDate).toBeInstanceOf(Date);
    });

    test("defaults: priority='medium', dueDate=null when not provided", () => {
      const p = new PriorityTask(baseData);
      expect(p.priority).toBe("medium");
      expect(p.dueDate).toBeNull();
    });

    describe("isOverDue() logic (per current implementation)", () => {
      test("returns false when dueDate is null", () => {
        const p = new PriorityTask(baseData, "low", null);
        expect(p.isOverDue()).toBe(false);
      });

      test("returns false when past due but not completed", () => {
        const past = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const p = new PriorityTask(baseData, "low", past);
        // completed is false by default in baseData
        expect(p.isOverDue()).toBe(false);
      });

      test("returns true when past due AND completed = true", () => {
        const past = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const p = new PriorityTask(
          { ...baseData, completed: true },
          "low",
          past
        );
        expect(p.isOverDue()).toBe(true);
      });

      test("returns false when dueDate is in the future", () => {
        const future = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const p = new PriorityTask(
          { ...baseData, completed: true },
          "low",
          future
        );
        expect(p.isOverDue()).toBe(false);
      });
    });

    describe("getStatus()", () => {
      test('returns "overdue" when isOverDue() is true', () => {
        const past = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const p = new PriorityTask(
          { ...baseData, completed: true },
          "high",
          past
        );
        expect(p.getStatus()).toBe("overdue");
      });

      test("delegates to super.getStatus() when not overdue and completed=false", () => {
        const p = new PriorityTask(baseData, "medium", null);
        expect(p.getStatus()).toBe("Pending");
      });

      test("delegates to super.getStatus() when not overdue and completed=true", () => {
        const p = new PriorityTask(
          { ...baseData, completed: true },
          "medium",
          null
        );
        expect(p.getStatus()).toBe("Completed");
      });
    });

    describe("toggle()", () => {
      test("returns object with id, completed, priority and toggles completion", () => {
        const p = new PriorityTask(baseData, "high", null);
        const result = p.toggle();
        expect(result).toEqual({ id: 11, completed: true, priority: "high" });
        expect(p.completed).toBe(true);
      });

      test("second toggle returns to false", () => {
        const p = new PriorityTask(baseData, "high", null);
        p.toggle(); // true
        const result = p.toggle(); // false
        expect(result).toEqual({ id: 11, completed: false, priority: "high" });
        expect(p.completed).toBe(false);
      });
    });
  });
});
``;
