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
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col gap-3">

      <div>
        <h2 className="text-xl font-semibold">
          {project.name}
        </h2>

        {project.description && (
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            {project.description}
          </p>
        )}
      </div>

      <div className="flex gap-3 mt-2">
        <Link
          to={`/project/${project._id}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          Open
        </Link>

        <button
          onClick={() => onDelete(project._id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>

    </div>
  );
}