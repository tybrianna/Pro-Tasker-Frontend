import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import API from "../services/api";
import { Task } from "../types/Task";

const ProjectDetails = () => {
  const { id } = useParams();

  const [tasks,
    setTasks] =
    useState<Task[]>([]);

  const [title,
    setTitle] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const fetchTasks =
    async () => {
      try {
        const res =
          await API.get<Task[]>(
            `/tasks/project/${id}`
          );

        setTasks(
          res.data
        );
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask =
    async () => {
      try {
        await API.post(
          "/tasks",
          {
            title,
            description,
            project: id,
          }
        );

        setTitle("");
        setDescription("");

        fetchTasks();
      } catch (error) {
        console.error(error);
      }
    };

  const deleteTask =
    async (
      taskId: string
    ) => {
      try {
        await API.delete(
          `/tasks/${taskId}`
        );

        fetchTasks();
      } catch (error) {
        console.error(error);
      }
    };

  const updateStatus =
    async (
      taskId: string,
      status: string
    ) => {
      try {
        await API.put(
          `/tasks/${taskId}`,
          { status }
        );

        fetchTasks();
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div>
      <h1>
        Project Tasks
      </h1>

      <h2>
        Create Task
      </h2>

      <input
        placeholder="Task Title"
        value={title}
        onChange={(e) =>
          setTitle(
            e.target.value
          )
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
        onClick={createTask}
      >
        Add Task
      </button>

      <hr />

      {tasks.map(
        (task) => (
          <div
            key={task._id}
          >
            <h3>
              {task.title}
            </h3>

            <p>
              {task.description}
            </p>

            <p>
              Status:
              {" "}
              {task.status}
            </p>

            <select
              value={task.status}
              onChange={(e) =>
                updateStatus(
                  task._id,
                  e.target.value
                )
              }
            >
              <option>
                To Do
              </option>

              <option>
                In Progress
              </option>

              <option>
                Done
              </option>
            </select>

            <button
              onClick={() =>
                deleteTask(
                  task._id
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

export default ProjectDetails;