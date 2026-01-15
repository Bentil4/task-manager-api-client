import { APIClient } from "./api.js";
import { Task, User } from "./models.js";
import readline from "readline";
import { filterByStatus, groupByUser } from "./taskProcessor.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const apiClient = new APIClient();

async function main() {
  try {
    const [usersData, todosData] = await Promise.all([
      apiClient.fetchUser(),
      apiClient.fetchTodos(),
    ]);

    const users = usersData.map((user) => new User(user));
    const tasks = todosData.map((todos) => new Task(todos));

    const taskMap = groupByUser(tasks);
    users.forEach((user) => {
      user.tasks = taskMap.get(user.id || []);
    });

    promptUser(users, tasks);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    rl.close();
    process.exit(1);
  }
}

async function promptUser(users, tasks) {
  let loading = true;

  while (loading) {
    const menu = `
              ===== Task Manager API Client =====
          1. Show all tasks
          2. Show completed tasks
          3. Show pending tasks
          4. Show user statistics
          5. Show tasks for a user
          6. List all users
          7. Exit
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
        await displayUserTasks(users, apiClient);
        break;
      case "6":
        users.forEach((user) => console.log(user.toString()));
        break;
      case "7":
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

async function displayUserTasks(users, apiClient) {
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
  console.log(user.name);
  const userTodos = await apiClient.fetchUserTodos(userId);

  const userTasks = userTodos.map((task) => new Task(task));
  const table = userTasks.map((task) => ({
    title: task.title,
    status: task.getStatus(),
  }));
  console.table(table);
}

main();
