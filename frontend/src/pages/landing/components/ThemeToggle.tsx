import { Moon, Sun } from 'lucide-react';
import useTheme from '../../../store/theme';

export function ThemeToggle() {
  const toggleTheme = useTheme((state: any) => state.toggleTheme);
  const theme = useTheme((state: any) => state.theme);
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-zinc-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}