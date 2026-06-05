import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { Project } from "../types/Project";

const Dashboard = () => {
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [name, setName] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const fetchProjects =
    async () => {
      try {
        const res =
          await API.get<Project[]>(
            "/projects"
          );

        setProjects(res.data);
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject =
    async () => {
      try {
        await API.post(
          "/projects",
          {
            name,
            description,
          }
        );

        setName("");
        setDescription("");

        fetchProjects();
      } catch (error) {
        console.error(error);
      }
    };

  const deleteProject =
    async (id: string) => {
      try {
        await API.delete(
          `/projects/${id}`
        );

        fetchProjects();
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div>
      <h1>
        Project Dashboard
      </h1>

      <h2>
        Create Project
      </h2>

      <input
        placeholder="Project Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
      />

      <button
        onClick={createProject}
      >
        Create
      </button>

      <hr />

      {projects.map(
        (project) => (
          <div
            key={project._id}
          >
            <h3>
              {project.name}
            </h3>

            <p>
              {project.description}
            </p>

            <Link
              to={`/project/${project._id}`}
            >
              Open
            </Link>

            <button
              onClick={() =>
                deleteProject(
                  project._id
                )
              }
            >
              Delete
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default Dashboard;