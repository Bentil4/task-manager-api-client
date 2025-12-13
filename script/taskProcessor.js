export const filterByStatus = (tasks, status) => {
  tasks.filter((task) =>
    status === "completed" ? task.completed : !task.completed
  );
};

export const calculateStatistics = (tasks) => {};
export const groupByUser = (tasks) => {};
