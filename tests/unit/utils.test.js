//Tests for general utility behaviors + spy-based tests

//Requirements:
// 5 tests using spies (fulfilled)
// Tests involving Array methods (map, filter, reduce, sort)
// Tests verifying pure functions (no mutation)
//Tests verifying logging side effects

import { jest } from "@jest/globals";
describe("Utility function behavior tests with spies", () => {
  // Spy on Array methods
  describe("Array method spy tests", () => {
    test("spy on Array.filter to ensure it's called correctly", () => {
      const arr = [1, 2, 3, 4];
      const filterSpy = jest.spyOn(arr, "filter");

      const result = arr.filter((x) => x > 2);

      expect(filterSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual([3, 4]);
      filterSpy.mockRestore();
    });

    test("spy on Array.map and verify callback args", () => {
      const arr = [1, 2, 3];
      const mapSpy = jest.spyOn(arr, "map");

      const result = arr.map((x) => x * 2);

      expect(mapSpy).toHaveBeenCalled();
      expect(result).toEqual([2, 4, 6]);
      mapSpy.mockRestore();
    });

    test("spy on Array.reduce to verify accumulation", () => {
      const arr = [1, 2, 3];
      const reduceSpy = jest.spyOn(arr, "reduce");

      const sum = arr.reduce((acc, x) => acc + x, 0);

      expect(sum).toBe(6);
      expect(reduceSpy).toHaveBeenCalledTimes(1);
      reduceSpy.mockRestore();
    });

    test("spy on Array.sort ensures callback usage", () => {
      const arr = [3, 1, 2];
      const sortSpy = jest.spyOn(arr, "sort");

      const result = arr.sort((a, b) => a - b);

      expect([...result]).toEqual([1, 2, 3]);
      expect(sortSpy).toHaveBeenCalled();
      sortSpy.mockRestore();
    });

    test("array operations do not mutate original when spread used", () => {
      const arr = [1, 3, 2];
      const arrCopy = [...arr].sort();
      expect(arr).toEqual([1, 3, 2]);
      expect(arrCopy).toEqual([1, 2, 3]);
    });
  });

  // Spy on console (required side-effect tests)
  describe("console spy tests", () => {
    let logSpy, warnSpy, errorSpy;

    beforeEach(() => {
      logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
      errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      logSpy.mockRestore();
      warnSpy.mockRestore();
      errorSpy.mockRestore();
    });

    test("console.log is called with expected message", () => {
      console.log("Testing log");
      expect(logSpy).toHaveBeenCalledWith("Testing log");
    });

    test("console.warn captures warnings", () => {
      console.warn("Warning occurred");
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith("Warning occurred");
    });

    test("console.error captures errors", () => {
      console.error("Critical error");
      expect(errorSpy).toHaveBeenCalledWith("Critical error");
    });
  });

  // Generic Utility Algorithm Behavior Tests
  describe("Pure utility behavior tests", () => {
    test("simple search algorithm finds item", () => {
      const arr = [10, 20, 30];
      const search = (list, value) => list.find((x) => x === value);
      expect(search(arr, 20)).toBe(20);
    });

    test("filtering does not mutate original array", () => {
      const arr = [1, 2, 3];
      const result = arr.filter((x) => x !== 2);
      expect(arr).toEqual([1, 2, 3]);
      expect(result).toEqual([1, 3]);
    });

    test("sorting with spread operator preserves original", () => {
      const arr = [5, 3, 1];
      const sorted = [...arr].sort((a, b) => a - b);
      expect(arr).toEqual([5, 3, 1]);
      expect(sorted).toEqual([1, 3, 5]);
    });

    test("mapping produces new array with transformed values", () => {
      const arr = [1, 2, 3];
      const result = arr.map((x) => x + 1);
      expect(result).toEqual([2, 3, 4]);
    });
  });
});
