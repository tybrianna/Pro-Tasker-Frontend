interface Task {
  _id: string;
  title: string;
  status: "To Do" | "In Progress" | "Done" | "Blocked";
  type: "Feature" | "Bug" | "Improvement" | "Research";
}

interface Props {
  task: Task;
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onUpdateStatus, onDelete }: Props) {
  const statusColor = {
    "To Do": "bg-gray-400",
    "In Progress": "bg-yellow-500",
    "Done": "bg-green-500",
    "Blocked": "bg-red-500",
  }[task.status];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col gap-2">

      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{task.title}</h3>

        <span className={`text-white text-xs px-2 py-1 rounded ${statusColor}`}>
          {task.status}
        </span>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-300">
        Type: {task.type}
      </p>

      <select
        value={task.status}
        onChange={(e) => onUpdateStatus(task._id, e.target.value)}
        className="border p-1 rounded text-sm dark:bg-gray-700"
      >
        <option>To Do</option>
        <option>In Progress</option>
        <option>Done</option>
        <option>Blocked</option>
      </select>

      <button
        onClick={() => onDelete(task._id)}
        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
      >
        Delete Task
      </button>

    </div>
  );
}