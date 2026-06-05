import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import TaskCard from "../components/TaskCard";
import { AuthContext } from "../context/AuthContext";

interface ProjectDetail {
  _id: string;
  name: string;
  description?: string;
}

interface TaskItem {
  _id: string;
  title: string;
  status: "To Do" | "In Progress" | "Done" | "Blocked";
  type: "Feature" | "Bug" | "Improvement" | "Research";
}

const statusOptions = [
  { value: "To Do", label: "Incomplete" },
  { value: "In Progress", label: "In Progress" },
  { value: "Done", label: "Complete" },
  { value: "Blocked", label: "Blocked" },
];

const getGuestTasks = (id: string): TaskItem[] =>
  JSON.parse(localStorage.getItem(`guest_tasks_${id}`) || "[]");

const saveGuestTasks = (id: string, tasks: TaskItem[]) =>
  localStorage.setItem(`guest_tasks_${id}`, JSON.stringify(tasks));

export default function Project() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const isGuest = !user;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const loadProject = async () => {
    if (!id) return;
    if (isGuest) {
      const stored = JSON.parse(localStorage.getItem("guest_projects") || "[]");
      const found = stored.find((p: any) => p._id === id);
      setProject(found || { _id: id, name: "My List", description: "Custom" });
      return;
    }
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTasks = async () => {
    if (!id) return;
    if (isGuest) {
      setTasks(getGuestTasks(id));
      return;
    }
    try {
      const res = await api.get(`/tasks/project/${id}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProject();
    loadTasks();
  }, [id, isGuest]);

  const create = async () => {
    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }
    if (!id) return;

    if (isGuest) {
      const newTask: TaskItem = {
        _id: `guest_task_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        title: title.trim(),
        status: "To Do",
        type: "Feature",
      };
      saveGuestTasks(id, [...getGuestTasks(id), newTask]);
      setTitle("");
      setError("");
      loadTasks();
      return;
    }

    try {
      await api.post("/tasks", { title: title.trim(), projectId: id });
      setTitle("");
      setError("");
      loadTasks();
    } catch (err) {
      console.error(err);
      setError("Unable to save task. Please try again.");
    }
  };

  const updateTask = async (taskId: string, updates: Partial<{ title: string; status: string }>) => {
    if (!id) return;
    if (isGuest) {
      const updated = getGuestTasks(id).map((t) =>
        t._id === taskId ? { ...t, ...updates } : t
      );
      saveGuestTasks(id, updated);
      loadTasks();
      return;
    }
    try {
      await api.put(`/tasks/${taskId}`, updates);
      loadTasks();
    } catch (err) {
      console.error(err);
      setError("Unable to update task. Please try again.");
    }
  };

  const removeTask = async (taskId: string) => {
    if (!id) return;
    if (isGuest) {
      saveGuestTasks(id, getGuestTasks(id).filter((t) => t._id !== taskId));
      loadTasks();
      return;
    }
    try {
      await api.delete(`/tasks/${taskId}`);
      loadTasks();
    } catch (err) {
      console.error(err);
      setError("Unable to delete task.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <section className="rounded-3xl bg-white dark:bg-slate-900 shadow-lg p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              {isGuest ? "Guest · Local only" : "Task list"}
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900 dark:text-white">
              {project?.name || "Loading list..."}
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {project?.description || "Manage tasks for your list."}
            </p>
          </div>

          <div className="grid gap-3 w-full max-w-xl">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              New task title
            </label>
            <div className="flex gap-3">
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && create()}
                placeholder="Write a task title"
              />
              <button
                onClick={create}
                className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Add
              </button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tasks</p>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Your task board
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400">
            {statusOptions.map((status) => (
              <span
                key={status.value}
                className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700"
              >
                {status.label}
              </span>
            ))}
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
            This list has no tasks yet. Add one to get started.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={updateTask}
                onDelete={removeTask}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
