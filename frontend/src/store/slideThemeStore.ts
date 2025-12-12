import { create } from "zustand";

export interface Theme {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  background_color: string;
  text_color: string;
  accent_color: string;
  accent_color_2: string;
  accent_color_3: string;
  gradient_start?: string;
  gradient_end?: string;
  preview_image_url?: string;
  is_active: boolean;
}

interface SlideThemeStore {
  themes: Theme[];
  selectedTheme: Theme | null;
  setThemes: (themes: Theme[]) => void;
  setSelectedTheme: (theme: Theme | null) => void;
  getThemeByName: (name: string) => Theme | undefined;
}

const defaultTheme: Theme = {
  id: 0,
  name: "dark",
  display_name: "Dark",
  description: "Classic dark theme with white text",
  background_color: "#1a1a1a",
  text_color: "#ffffff",
  accent_color: "#667eea",
  accent_color_2: "#ff6b6b",
  accent_color_3: "#51cf66",
  is_active: true,
};

const useSlideThemeStore = create<SlideThemeStore>((set, get) => ({
  themes: [defaultTheme],
  selectedTheme: defaultTheme,
  setThemes: (themes) => set({ themes }),
  setSelectedTheme: (theme) => set({ selectedTheme: theme }),
  getThemeByName: (name) => {
    const { themes } = get();
    return themes.find((t) => t.name === name);
  },
}));

export default useSlideThemeStore;
export { useSlideThemeStore };
