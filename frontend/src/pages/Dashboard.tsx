import {
  useEffect,
  useState,
} from "react";

import API from "../services/api";

import {
  Project,
} from "../types/Project";

function Dashboard() {
  const [
    projects,
    setProjects,
  ] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects =
    async (): Promise<void> => {
      const res =
        await API.get<Project[]>(
          "/projects"
        );

      setProjects(
        res.data
      );
    };

  return (
    <div>
      <h1>
        My Projects
      </h1>

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
          </div>
        )
      )}
    </div>
  );
}

export default Dashboard;