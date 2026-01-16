import { sum, empty } from "../script/api.js";

test("add two numbers", () => {
  expect(sum(2, 2)).toBe(4);
});

test("to be falsy", () => {
  expect(empty()).toBeTruthy();
});
