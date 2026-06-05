import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const statusColors: Record<string, string> = {
  "To Do": "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  "In Progress": "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  "Done": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
  "Blocked": "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
};

export default function Calendar() {
  const { user } = useContext(AuthContext);
  const isGuest = !user;

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskStatus, setTaskStatus] = useState("To Do");

  const navigate = useNavigate();
  const today = new Date();

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const loadTasks = async () => {
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
    if (!isGuest) loadTasks();
  }, [isGuest]);

  if (isGuest) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] font-bold text-indigo-600 dark:text-indigo-400">📅 Schedule</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">Task Calendar</h1>
        </div>
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-8 py-20 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 text-5xl">📅</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in to use the Calendar</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            The calendar syncs your tasks across sessions — create a free account to get started.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/register"
              className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Create account
            </Link>
            <Link
              to="/login"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getTasksForDate = (day: number): Task[] =>
    tasks.filter((task) => {
      if (!task.dueDate) return false;
      const d = new Date(task.dueDate);
      return (
        d.getDate() === day &&
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear()
      );
    });

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const prevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const goToToday = () => setCurrentDate(new Date());

  const createTask = async () => {
    if (!selectedDate || !taskTitle.trim()) return;
    try {
      await api.post("/tasks", {
        title: taskTitle.trim(),
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") createTask();
    if (e.key === "Escape") setSelectedDate(null);
  };

  return (
    <div className="mx-auto max-w-6xl py-10">

      {/* HEADER */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] font-bold text-indigo-600 dark:text-indigo-400">
            📅 Schedule
          </p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
            Task Calendar
          </h1>
        </div>
        <button
          onClick={goToToday}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Today
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      )}

      {!loading && (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">

          {/* MONTH NAV */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
            <button
              onClick={prevMonth}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              ← Prev
            </button>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>

            <button
              onClick={nextMonth}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Next →
            </button>
          </div>

          {/* DAY HEADERS */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
            {DAY_NAMES.map((d) => (
              <div
                key={d}
                className="py-3 text-center text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500"
              >
                {d}
              </div>
            ))}
          </div>

          {/* CALENDAR GRID */}
          <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700">
            {days.map((day, index) => {
              const dayTasks = day ? getTasksForDate(day) : [];
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
                      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                    );
                  }}
                  className={`min-h-[100px] p-2 transition-colors
                    ${!day
                      ? "bg-slate-50 dark:bg-slate-900/50"
                      : isToday
                        ? "bg-indigo-50 dark:bg-indigo-950/60 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-950"
                        : "bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
                >
                  {day && (
                    <>
                      <div className="mb-1 flex justify-end">
                        <span
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold
                            ${isToday
                              ? "bg-indigo-600 text-white"
                              : "text-slate-700 dark:text-slate-300"
                            }`}
                        >
                          {day}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {dayTasks.slice(0, 2).map((task) => (
                          <div
                            key={task._id}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/project/${task.project._id}`);
                            }}
                            className={`truncate rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer transition hover:opacity-80 ${statusColors[task.status] ?? "bg-slate-100 text-slate-700"}`}
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="px-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* LEGEND */}
          <div className="flex flex-wrap gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
            {Object.entries(statusColors).map(([label, cls]) => (
              <span key={label} className={`rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* MODAL */}
      {selectedDate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedDate(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              New Task
            </h2>
            <p className="mt-1 mb-5 text-sm text-slate-500 dark:text-slate-400">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Task title
                </label>
                <input
                  autoFocus
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-indigo-900"
                  placeholder="What needs to be done?"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Status
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-900"
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedDate(null)}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={createTask}
                className="flex-1 rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg disabled:opacity-50"
                disabled={!taskTitle.trim()}
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
