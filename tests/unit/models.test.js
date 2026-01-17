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

  // User Class
  describe("User", () => {
    let user;

    beforeEach(() => {
      user = new User({
        id: 501,
        name: "Nana Bentil",
        email: "bentil@example.com",
      });
    });

    describe("constructor()", () => {
      test("initializes fields and starts with empty tasks array", () => {
        expect(user.id).toBe(501);
        expect(user.name).toBe("Nana Bentil");
        expect(user.email).toBe("bentil@example.com");
        expect(Array.isArray(user.tasks)).toBe(true);
        expect(user.tasks.length).toBe(0);
      });
    });

    describe("addTask()", () => {
      test("adds a valid Task instance", () => {
        const t = new Task({
          id: 1,
          title: "T",
          completed: false,
          userId: 501,
        });
        user.addTask(t);
        expect(user.tasks).toHaveLength(1);
        expect(user.tasks[0]).toBe(t);
      });

      test("throws when adding a non-Task object", () => {
        expect(() => user.addTask({ id: 2 })).toThrow(
          "Can only add Task instances"
        );
      });

      test("throws when adding null", () => {
        expect(() => user.addTask(null)).toThrow("Can only add Task instances");
      });
    });

    describe("getCompletionRate()", () => {
      test("returns 0 when there are no tasks", () => {
        expect(user.getCompletionRate()).toBe(0);
      });

      test("calculates correct percentage for mixed tasks (1/2 = 50%)", () => {
        user.addTask(
          new Task({ id: 1, title: "A", completed: true, userId: 501 })
        );
        user.addTask(
          new Task({ id: 2, title: "B", completed: false, userId: 501 })
        );
        expect(user.getCompletionRate()).toBe(50);
      });

      test("calculates correct percentage with rounding tolerance (2/3 ≈ 66.67%)", () => {
        user.addTask(new Task({ id: 1, completed: true, userId: 501 }));
        user.addTask(new Task({ id: 2, completed: true, userId: 501 }));
        user.addTask(new Task({ id: 3, completed: false, userId: 501 }));
        expect(user.getCompletionRate()).toBeCloseTo(66.666, 2);
      });
    });

    describe("getTasksByStatus()", () => {
      let completedTask, pendingTask;

      beforeEach(() => {
        completedTask = new Task({
          id: 1,
          title: "Done",
          completed: true,
          userId: 501,
        });
        pendingTask = new Task({
          id: 2,
          title: "Todo",
          completed: false,
          userId: 501,
        });
        user.addTask(completedTask);
        user.addTask(pendingTask);
      });

      test("filters completed tasks", () => {
        const list = user.getTasksByStatus("completed");
        expect(list).toHaveLength(1);
        expect(list[0]).toBe(completedTask);
      });

      test("filters pending tasks", () => {
        const list = user.getTasksByStatus("pending");
        expect(list).toHaveLength(1);
        expect(list[0]).toBe(pendingTask);
      });
    });

    describe("toString() side effects", () => {
      let clearSpy, tableSpy;

      beforeEach(() => {
        clearSpy = jest.spyOn(console, "clear").mockImplementation(() => {});
        tableSpy = jest.spyOn(console, "table").mockImplementation(() => {});
      });

      afterEach(() => {
        clearSpy.mockRestore();
        tableSpy.mockRestore();
      });

      test("calls console.clear and console.table with expected structure", () => {
        user.addTask(
          new Task({ id: 1, title: "X", completed: false, userId: 501 })
        );
        user.toString(); // function logs a table; no explicit return currently

        expect(clearSpy).toHaveBeenCalledTimes(1);
        expect(tableSpy).toHaveBeenCalledTimes(1);
        // Ensure the table includes expected fields (the exact object shape is built in models.js)
        const callArg = tableSpy.mock.calls[0][0];
        expect(callArg).toMatchObject({
          id: 501,
          name: "Nana Bentil",
          email: "bentil@example.com",
          tasks: expect.stringMatching(/1 tasks/),
        });
      });
    });
  });
});
``;
