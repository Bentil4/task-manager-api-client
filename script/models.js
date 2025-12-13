export class Task {
  constructor({ id, title, completed, userId }) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.userId = userId;
  }

  toggle() {
    this.completed = !this.completed;
  }

  isOverDue() {
    return false;
  }

  getStatus() {
    return this.completed ? "Completed" : "Pending";
  }
}

export class PriorityTask extends Task {
  constructor(taskData, priority = "medium", dueDate = null) {
    super(taskData);
    this.priority = priority;
    this.dueDate = dueDate;
  }

  isOverDue() {
    if (!this.dueDate) return false;
    const now = new Date();
    return this.completed && this.dueDate < now;
  }

  getStatus() {
    if (this.isOverDue()) return "overdue";
    return super.getStatus();
  }

  toggle() {
    super.toggle();
    return { id: this.id, completed: this.completed, priority: this.priority };
  }
}

// User Class

export class User {
  constructor({ id, name, email }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.tasks = [];
  }

  addTask(task) {
    if (task instanceof Task) {
      this.tasks.push(task);
    } else {
      throw new Error("Can only add Task instances");
    }
  }

  getCompletionRate() {
    if (this.tasks.length === 0) return 0;
    const completed = this.tasks.filter((task) => task.completed).length;
    return (completed / this.tasks.length) * 100;
  }

  getTasksByStatus(completed) {
    return this.tasks.filter((task) =>
      completed === "completed" ? task.completed : !task.completed
    );
  }

  toString() {
    return `${this.name} <${this.email}> (${this.tasks.length} tasks)`;
  }
}
