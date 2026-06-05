import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import TaskCard from "../components/TaskCard";

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

export default function Project() {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const loadProject = async () => {
    if (!id) return;
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTasks = async () => {
    if (!id) return;
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
  }, [id]);

  const create = async () => {
    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    if (!id) return;

    try {
      await api.post("/tasks", {
        title: title.trim(),
        projectId: id,
      });
      setTitle("");
      setError("");
      loadTasks();
    } catch (err) {
      console.error(err);
      setError("Unable to save task. Please try again.");
    }
  };

  const updateTask = async (taskId: string, updates: Partial<{ title: string; status: string }>) => {
    try {
      await api.put(`/tasks/${taskId}`, updates);
      loadTasks();
    } catch (err) {
      console.error(err);
      setError("Unable to update task. Please try again.");
    }
  };

  const removeTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      loadTasks();
    } catch (err) {
      console.error(err);
      setError("Unable to delete task.");
    }
  };

  return (
    <div className="space-y-8 py-10">
      <section className="rounded-3xl bg-white dark:bg-slate-900 shadow-lg p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Task list
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
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Your task board</h2>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400">
            {statusOptions.map((status) => (
              <span key={status.value} className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">
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
