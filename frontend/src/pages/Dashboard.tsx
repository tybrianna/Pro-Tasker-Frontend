import { useEffect, useState } from "react";
import api from "../api/axios";
import ProjectCard from "../components/ProjectedCard";

const categories = [
  {
    value: "To-Do",
    label: "To-Do List",
    defaultName: "My To-Do List",
    description: "To-Do",
    accent: "bg-indigo-500",
  },
  {
    value: "Grocery",
    label: "Grocery List",
    defaultName: "Grocery List",
    description: "Grocery",
    accent: "bg-emerald-500",
  },
  {
    value: "Custom",
    label: "Custom List",
    defaultName: "My Custom List",
    description: "Custom",
    accent: "bg-slate-500",
  },
];

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("To-Do");
  const [name, setName] = useState(categories[0].defaultName);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const selectCategory = (category: string) => {
    const selected = categories.find((item) => item.value === category);
    setSelectedCategory(category);
    setName(selected?.defaultName || "");
    setError("");
  };

  const create = async () => {
    if (!name.trim()) {
      setError("Please enter a list name.");
      return;
    }

    try {
      await api.post("/projects", {
        name: name.trim(),
        description: selectedCategory,
      });
      setError("");
      setName(
        selectedCategory === "Custom"
          ? ""
          : categories.find((item) => item.value === selectedCategory)
              ?.defaultName || ""
      );
      load();
    } catch (error) {
      console.error(error);
      setError("Unable to create list. Make sure you are logged in.");
    }
  };

  const remove = async (id: string) => {
    await api.delete(`/projects/${id}`);
    load();
  };

  return (
    <div className="space-y-8 py-10">
      <section className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-2xl p-10 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] font-bold text-indigo-600 dark:text-indigo-400">
              ✨ Create a new list
            </p>
            <h1 className="mt-2 text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Your next list starts here
            </h1>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => selectCategory(category.value)}
              className={`rounded-2xl border-2 p-6 text-left transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category.value
                  ? `${category.accent} bg-opacity-20 border-2 shadow-lg ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900`
                  : "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950 hover:shadow-md"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                {category.label}
              </p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
                {category.defaultName}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {category.value === "Custom"
                  ? "Create a personalized list with your own title."
                  : `Build a ${category.label.toLowerCase()} that fits your daily flow.`}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-[1fr_auto] items-end">
          <div className="grid gap-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
              List name
            </label>
            <input
              className="w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Give your list a name"
            />
          </div>

          <button
            onClick={create}
            className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-sm font-bold text-white transition hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            + Create list
          </button>
        </div>

        {error && <p className="mt-3 text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>}
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] font-bold text-indigo-600 dark:text-indigo-400">📋 Saved lists</p>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mt-2">Manage your lists</h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} onDelete={remove} />
          ))}
          {projects.length === 0 && (
            <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-12 col-span-full text-center text-slate-600 dark:text-slate-400">
              <p className="text-lg font-semibold">📭 No lists yet</p>
              <p className="mt-2 text-sm">Create one above to get started!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}