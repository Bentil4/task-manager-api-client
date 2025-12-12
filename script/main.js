import { APIClient } from "./api.js";

const client = new APIClient();

console.log("users",client.fetchUser());
console.log("todoo", client.fetchTodos());
console.log("usertod", client.fetchUserTodos())
