import { APIClient } from "./api.js";
import { Task, User } from "./models.js";

const apiClient = new APIClient();

async function main() {
  const [usersData, todosData] = await Promise.all([
    apiClient.fetchUser(),
    apiClient.fetchTodos(),
  ]);

  const users = usersData.map((user) => new User(user));
  const tasks = todosData.map((todos) => new Task(todos));
  console.log(tasks);

  // PromptUser(users, tasks);

  function PromptUser(users, tasks) {
    let loading = true;

    while (loading) {
      const choice = prompt(`
              ===== Task Manager API Client =====
          \n1. Show all tasks
          \n2. Show completed tasks
          \n3. Show pending tasks
          \n4. Show user statistics
          \n5. Show tasks for a user
          \n6. Exit
          Choose an option:
              `);
    }
  }
}

main();
