export class Task {
  constructor({ id, title, completed = false, userId = null }) {
    this.id = id;
    this.title = title;
    this.completed = Boolean(completed);
    this.userId = userId;
  }

  toggle() {
    this.completed = !this.completed;
    return this.completed;
  }

  isOverDue() {
    return false;
  }

  getStatus() {
    return this.completed ? true : false;
  }
}

export class PriorityTask extends Task {
  constructor({
    id,
    title,
    completed = false,
    userId = null,
    priority = "normal",
    dueDate = null,
  } = {}) {
    super({ id, title, completed, dueDate });
    this.priority = priority;
    this.dueDate = dueDate ? new Date(dueDate) : null;
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
