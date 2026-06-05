import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams } from "react-router-dom";

export default function Project() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  const load = async () => {
    const res = await api.get(`/tasks/project/${id}`);
    setTasks(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await api.post("/tasks", {
      title,
      projectId: id,
    });

    setTitle("");
    load();
  };

  const update = async (taskId: string, status: string) => {
    await api.put(`/tasks/${taskId}`, { status });
    load();
  };

  const remove = async (taskId: string) => {
    await api.delete(`/tasks/${taskId}`);
    load();
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl mb-5">Tasks</h1>

      <input className="p-2 border" onChange={e => setTitle(e.target.value)} />
      <button className="bg-green-500 text-white p-2 ml-2" onClick={create}>
        Add Task
      </button>

      <div className="mt-6 space-y-3">
        {tasks.map(t => (
          <div key={t._id} className="p-4 border rounded">
            <h2>{t.title}</h2>

            <select onChange={e => update(t._id, e.target.value)} value={t.status}>
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
              <option>Blocked</option>
            </select>

            <button className="text-red-500 ml-3" onClick={() => remove(t._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}