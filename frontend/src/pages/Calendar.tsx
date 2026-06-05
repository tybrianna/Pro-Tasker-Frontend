import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

interface Task {
  _id: string;
  title: string;
  dueDate?: string | null;
  status: string;
  project: {
    _id: string;
    name: string;
  };
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // modal state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskStatus, setTaskStatus] = useState("To Do");

  const navigate = useNavigate();
  const today = new Date();

  const statusColors: Record<string, string> = {
    "To Do": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    "In Progress": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    "Done": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Blocked": "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  };

  const getDaysInMonth = (date: Date): number =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date): number =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const loadTasks = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<Task[]>("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const getTasksForDate = (day: number): Task[] => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;

      const taskDate = new Date(task.dueDate);

      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const prevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const createTask = async () => {
    if (!selectedDate || !taskTitle.trim()) return;

    try {
      await api.post("/tasks", {
        title: taskTitle,
        status: taskStatus,
        dueDate: selectedDate,
      });

      setTaskTitle("");
      setTaskStatus("To Do");
      setSelectedDate(null);

      await loadTasks();
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">
        Calendar
      </h1>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      )}

      {!loading && (
        <>
          {/* NAV */}
          <div className="flex justify-between items-center mb-6">
            <button onClick={prevMonth}>← Prev</button>

            <h2 className="text-2xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>

            <button onClick={nextMonth}>Next →</button>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const dayTasks = day ? getTasksForDate(day) : [];

              // ⭐ INLINE TODAY LOGIC (replaces isSameDay)
              const isToday =
                day === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear();

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (!day) return;

                    setSelectedDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day
                      )
                    );
                  }}
                  className={`min-h-24 p-2 border rounded-xl cursor-pointer transition hover:scale-[1.02]
                    ${day ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700" : ""}
                    ${isToday ? "ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/30" : ""}
                  `}
                >
                  {day && (
                    <>
                      <div className="font-bold text-sm">{day}</div>

                      {dayTasks.slice(0, 2).map((task) => (
                        <div
                          key={task._id}
                          onClick={() =>
                            navigate(`/project/${task.project._id}`)
                          }
                          className={`text-xs px-2 py-1 rounded mt-1 ${statusColors[task.status]}`}
                        >
                          {task.title}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* MODAL */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-[350px]">

            <h2 className="text-xl font-bold mb-4">Create Task</h2>

            <p className="text-sm mb-3 text-slate-500">
              {selectedDate.toDateString()}
            </p>

            <input
              className="w-full p-2 border rounded mb-3"
              placeholder="Task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />

            <select
              className="w-full p-2 border rounded mb-4"
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
              <option>Blocked</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDate(null)}
                className="flex-1 bg-slate-200 p-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={createTask}
                className="flex-1 bg-indigo-600 text-white p-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

