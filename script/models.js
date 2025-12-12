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
