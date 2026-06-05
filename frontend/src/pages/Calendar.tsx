import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

interface Task {
  _id: string;
  title: string;
  dueDate?: string | null;
  status: string;
  project: {
    _id: string;
    name: string;
  };
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const statusColors: Record<string, string> = {
    "To Do": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    "In Progress": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    "Done": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Blocked": "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  };

  const getDaysInMonth = (date: Date): number =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date): number =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const loadTasks = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<Task[]>("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const getTasksForDate = (day: number): Task[] => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;

      const taskDate = new Date(task.dueDate);

      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const monthNames: string[] = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const prevMonth = (): void =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

  const nextMonth = (): void =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  return (
    <div>
      {/* KEEP YOUR EXISTING JSX HERE */}
    </div>
  );
}