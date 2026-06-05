import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState("");

  const load = async () => {
    const res = await api.get("/projects");
    setProjects(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await api.post("/projects", { name });
    setName("");
    load();
  };

  const remove = async (id: string) => {
    await api.delete(`/projects/${id}`);
    load();
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl mb-5">Projects</h1>

      <input className="p-2 border" placeholder="Project name" onChange={e => setName(e.target.value)} />
      <button className="bg-blue-500 text-white p-2 ml-2" onClick={create}>
        Create
      </button>

      <div className="grid gap-4 mt-6">
        {projects.map(p => (
          <div key={p._id} className="p-4 border rounded">
            <h2>{p.name}</h2>

            <Link className="text-blue-500" to={`/project/${p._id}`}>
              Open
            </Link>

            <button className="text-red-500 ml-4" onClick={() => remove(p._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}