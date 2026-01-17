import { jest } from "@jest/globals";

// Mock implementation of the APIClient for Jest tests

// Requirements:
// Should provide mock user data
// Should provide mock todo data
// All API methods return Promises
// Should be used when using jest.mock("../../api.js")

export const mockUsers = [
  { id: 1, name: "User One", email: "u1@mail.com" },
  { id: 2, name: "User Two", email: "u2@mail.com" },
];

export const mockTodos = [
  { id: 101, title: "Task A", completed: false, userId: 1 },
  { id: 102, title: "Task B", completed: true, userId: 1 },
  { id: 103, title: "Task C", completed: false, userId: 2 },
];

// Mocked APIClient
export const APIClient = jest.fn().mockImplementation(() => {
  return {
    fetchUser: jest.fn().mockResolvedValue(mockUsers),

    fetchTodos: jest.fn().mockResolvedValue(mockTodos),

    fetchUserTodos: jest.fn().mockImplementation((userId) => {
      return Promise.resolve(mockTodos.filter((t) => t.userId === userId));
    }),

    CachedData: jest.fn().mockResolvedValue([]),
  };
});
