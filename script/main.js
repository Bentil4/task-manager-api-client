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

  users.forEach((user) => {
    user.tasks = tasks.filter((task) => task.userId === user.id);
  });

  promptUser(users, tasks);
}

function promptUser(users, tasks) {
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

    switch (choice) {
      case "1":
        displayTask(tasks);
        break;
      default:
        console.log("Unknown choice: ", choice);
    }
  }
}

function displayTask(tasks) {
  console.clear();
  console.log(`\n Task List (${tasks.length} )`);
  const table = tasks.slice(0, 20).map((task) => ({
    id: task.id,
    title: task.title,
    status: task.getStatus(),
    userId: task.userId,
  }));

  console.table(table);
}

main();
