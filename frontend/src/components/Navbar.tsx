import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 shadow">
      <div className="flex space-x-4">
        <Link to="/" className="font-semibold">
          Dashboard
        </Link>

        <Link to="/login" className="font-medium text-sm text-gray-600 dark:text-gray-300">
          Login
        </Link>
      </div>

      <ThemeToggle />
    </div>
  );
}