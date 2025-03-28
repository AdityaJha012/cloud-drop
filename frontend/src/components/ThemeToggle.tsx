import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={toggleTheme}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer transition-colors peer-checked:bg-gradient-to-br peer-checked:from-blue-500 peer-checked:to-violet-500 dark:peer-checked:from-blue-600 dark:peer-checked:to-violet-600" />
      <span className="absolute top-1 left-1 w-4 h-4 flex items-center justify-center bg-white dark:bg-gray-100 rounded-full shadow-md transform peer-checked:translate-x-5 transition">
        {theme === "light" ? (
          <Moon className="w-3 h-3 text-gray-800" />
        ) : (
          <Sun className="w-3 h-3 text-gray-800" />
        )}
      </span>
    </label>
  );
};

export default ThemeToggle;
