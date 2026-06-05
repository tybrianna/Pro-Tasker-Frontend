import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { dark, setDark } = useContext(ThemeContext);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm"
    >
      {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}