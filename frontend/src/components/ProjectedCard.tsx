import { Link } from "react-router-dom";

interface Project {
  _id: string;
  name: string;
  description?: string;
}

interface Props {
  project: Project;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: Props) {
  const categoryColors: Record<string, { bg: string; accent: string; icon: string }> = {
    "To-Do": { bg: "from-indigo-50 to-indigo-100 dark:from-indigo-900/40 dark:to-indigo-900/20", accent: "indigo", icon: "✓" },
    "Grocery": { bg: "from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-900/20", accent: "emerald", icon: "🛒" },
    "Custom": { bg: "from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900", accent: "slate", icon: "📌" },
  };

  const category = categoryColors[project.description as string] || categoryColors["Custom"];

  return (
    <div className={`rounded-3xl bg-gradient-to-br ${category.bg} border-2 border-slate-200 dark:border-slate-700 shadow-md transition hover:shadow-xl hover:scale-105 p-6 flex flex-col gap-4`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{category.icon}</span>
            <span className="text-xs uppercase tracking-widest font-bold text-slate-600 dark:text-slate-300">
              {project.description || "Custom"}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {project.name}
          </h2>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <Link
          to={`/project/${project._id}`}
          className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold px-4 py-2 text-center transition shadow-md hover:shadow-lg"
        >
          📂 Open
        </Link>

        <button
          onClick={() => onDelete(project._id)}
          className="rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold px-4 py-2 transition shadow-md hover:shadow-lg"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}