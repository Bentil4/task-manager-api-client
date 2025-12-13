export const filterByStatus = (tasks, status) => {
  tasks.filter((task) =>
    status === "completed" ? task.completed : !task.completed
  );
};

export const calculateStatistics = (tasks) => {
  tasks.reduce(
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

export const groupByUser = (tasks) => {};
