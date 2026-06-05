import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">

        <h1 className="text-xl font-bold tracking-wide">
          Project Manager
        </h1>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
}
