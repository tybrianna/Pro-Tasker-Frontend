import { useState } from "react";

interface Task {
  _id: string;
  title: string;
  status: "To Do" | "In Progress" | "Done" | "Blocked";
  type: "Feature" | "Bug" | "Improvement" | "Research";
}

interface Props {
  task: Task;
  onUpdate: (id: string, updates: Partial<{ title: string; status: string }>) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<Task["status"], string> = {
  "To Do": "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg",
  "In Progress": "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg",
  Done: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg",
  Blocked: "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg",
};

export default function TaskCard({ task, onUpdate, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);

  const handleSave = () => {
    if (draftTitle.trim() && draftTitle.trim() !== task.title) {
      onUpdate(task._id, { title: draftTitle.trim() });
    }
    setIsEditing(false);
  };

  return (
    <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 dark:border-slate-700 p-6 shadow-md transition hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3 flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Edit title</label>
              <input
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-bold text-white transition hover:from-emerald-600 hover:to-teal-600"
                >
                  ✓ Save
                </button>
                <button
                  onClick={() => {
                    setDraftTitle(task.title);
                    setIsEditing(false);
                  }}
                  className="rounded-2xl border-2 border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  ✕ Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{task.title}</h3>
              <div className="mt-2 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                🏷️ {task.type}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColors[task.status]}`}>
            {task.status}
          </span>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-full border-2 border-slate-300 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            {isEditing ? "✎" : "✏️"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <select
          value={task.status}
          onChange={(e) => onUpdate(task._id, { status: e.target.value })}
          className="rounded-2xl border-2 border-slate-300 bg-white px-4 py-2 text-slate-900 font-semibold outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
        >
          <option value="To Do">📋 To Do</option>
          <option value="In Progress">⚙️ In Progress</option>
          <option value="Done">✓ Done</option>
          <option value="Blocked">🚫 Blocked</option>
        </select>

        <button
          onClick={() => onDelete(task._id)}
          className="rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-sm font-bold text-white transition hover:from-rose-600 hover:to-pink-600 shadow-md hover:shadow-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
