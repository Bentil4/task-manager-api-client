import { APIClient } from "./api.js";
import { Task, User } from "./models.js";
import readline from "readline";
// import { promisify } from "util";
import {
  filterByStatus,
  calculateStatistics,
  groupByUser,
} from "./taskProcessor.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

// const question = promisify(rl.question).bind(rl);

const apiClient = new APIClient();

async function main() {
  try {
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
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
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
      case "2":
        displayTask(filterByStatus(tasks, "completed"));
        break;
      case "3":
        displayTask(filterByStatus(tasks, "pending"));
        break;
      case "4":
        displayUserStatistics(users);
        break;
      case "5":
        await displayUserTasks(users, tasks);
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
  if (!tasks || !Array.isArray(tasks)) {
    console.log("No tasks to display");
    return;
  }
  console.clear();
  console.log(`\n Total Task List (${tasks.length})`);
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
        ${user.name} <${user.email}>
        
        Total Tasks : ${user.tasks.length}
        Completed: ${user.getTasksByStatus("completed").length}
        Pending: ${user.getTasksByStatus("pending").length}
        Completion Percentage: ${user.getCompletionRate()}%
        `);
  });
}

async function displayUserTasks(users, tasks) {
  const userInput = await question("Enter user ID: ");
  const userId = Number(userInput.trim());
  if (!Number.isInteger(userId)) {
    console.log("Please enter a valid numeric user ID.");
  }

  const user = users.find((user) => user.id === userId);

  if (!user) {
    console.log("User not found");
    return;
  }
  console.clear();
  console.log("User Tasks");
  console.log(user.name);
  const userTask = tasks.map((task) => ({
    title: task.title,
    status: task.getStatus(),
  }));
  console.table(userTask);
}

main();
