//  Unit tests for taskProcessor.js functions:
// filterByStatus
// calculateStatistics
// groupByUser

import {
  filterByStatus,
  calculateStatistics,
  groupByUser,
} from "../../script/taskProcessor.js";

describe("taskProcessor utilities", () => {
  // Sample test data
  const tasks = [
    { id: 1, title: "A", completed: true, userId: 1 },
    { id: 2, title: "B", completed: false, userId: 1 },
    { id: 3, title: "C", completed: true, userId: 2 },
    { id: 4, title: "D", completed: false, userId: 3 },
  ];

  // filterByStatus()
  describe("filterByStatus()", () => {
    test("filters completed tasks", () => {
      const result = filterByStatus(tasks, "completed");
      expect(result.length).toBe(2);
      expect(result.every((t) => t.completed === true)).toBe(true);
    });

    test("filters pending tasks", () => {
      const result = filterByStatus(tasks, "pending");
      expect(result.length).toBe(2);
      expect(result.every((t) => t.completed === false)).toBe(true);
    });

    test("empty array returns empty array", () => {
      expect(filterByStatus([], "completed")).toEqual([]);
    });

    test("throws when tasks is null", () => {
      expect(() => filterByStatus(null, "completed")).toThrow();
    });

    test("invalid status defaults to pending path", () => {
      const result = filterByStatus(tasks, "invalid");
      expect(result.length).toBe(2);
      expect(result.every((t) => t.completed === false)).toBe(true);
    });
  });

  // calculateStatistics()
  describe("calculateStatistics()", () => {
    test("counts completed and pending tasks correctly", () => {
      const stats = calculateStatistics(tasks);
      expect(stats).toEqual({ completed: 2, pending: 2 });
    });

    test("empty array returns zeroed statistics", () => {
      const stats = calculateStatistics([]);
      expect(stats).toEqual({ completed: 0, pending: 0 });
    });

    test("handles all tasks completed", () => {
      const stats = calculateStatistics([
        { completed: true },
        { completed: true },
      ]);
      expect(stats).toEqual({ completed: 2, pending: 0 });
    });

    test("handles all tasks pending", () => {
      const stats = calculateStatistics([
        { completed: false },
        { completed: false },
      ]);
      expect(stats).toEqual({ completed: 0, pending: 2 });
    });

    test("throws if tasks is null", () => {
      expect(() => calculateStatistics(null)).toThrow();
    });
  });
});
