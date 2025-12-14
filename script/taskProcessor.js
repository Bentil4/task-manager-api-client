export const filterByStatus = (tasks, status) => {
  return tasks.filter((task) =>
    status === "completed" ? task.completed : !task.completed
  );
};

export const calculateStatistics = (tasks) => {
  return tasks.reduce(
    (statistics, task) => {
      task.completed ? statistics.completed++ : statistics.pending++;
      return statistics;
    },
    {
      completed: 0,
      pending: 0,
    }
  );
};

export const groupByUser = (tasks) => {
  const map = new Map();
  tasks.forEach((task) => {
    if (!map.has(task.userId)) {
      map.set(task.userId, []);
    }
    map.get(task.userId).push(task);
  });
  return map;
};
