import { create } from "zustand";

const useTheme = create((set) => ({
  theme: localStorage.getItem("theme") || "light",
  toggleTheme: () =>
    set((state: any) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    }),
}));

export default useTheme;
