import { APIClient } from "./api.js";
import { Task, User } from "./models.js";
import readline from "readline";
import { promisify } from "util";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = promisify(rl.question).bind(rl);

const apiClient = new APIClient();

async function main() {
  const [usersData, todosData] = await Promise.all([
    apiClient.fetchUser(),
    apiClient.fetchTodos(),
  ]);

  const users = usersData.map((user) => new User(user));
  const tasks = todosData.map((todos) => new Task(todos));
  // console.log(tasks);

  users.forEach((user) => {
    user.tasks = tasks.filter((task) => task.userId === user.id);
  });

  promptUser(users, tasks);
}

async function promptUser(users, tasks) {
  let loading = true;

  while (loading) {
    const menu = `
              ===== Task Manager API Client =====
          \n1. Show all tasks
          \n2. Show completed tasks
          \n3. Show pending tasks
          \n4. Show user statistics
          \n5. Show tasks for a user
          \n6. Exit
          Choose an option:
              `;
    const choice = await question(menu);

    switch (choice.trim()) {
      case "1":
        displayTask(tasks);
        break;
      case "4":
        displayUserStatistics(users);
        break;
      case "6":
        loading = false;
        break;
      default:
        console.log("Unknown choice: ", choice);
    }
  }

  rl.close();
}

function displayTask(tasks) {
  console.clear();
  console.log(`\n Total Task List (${tasks.length} )`);
  const table = tasks.slice(0, 20).map((task) => ({
    id: task.id,
    title: task.title,
    status: task.getStatus(),
    userId: task.userId,
  }));

  console.table(table);
}

function displayUserStatistics(users) {
  console.clear();
  console.log("Total User Statistics");

  users.forEach((user) => {
    console.log(`
        ${user.name} <${user.email}
        
        Total Tasks : ${user.tasks.length}
        Completed: ${user.getTasksByStatus("Completed").length}
        Pending: ${user.getTasksByStatus("Pending").length}
        Completion Percentage: ${user.getCompletionRate()}%
        `);
  });
}

main();
