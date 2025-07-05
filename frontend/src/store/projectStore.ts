import { create } from "zustand";

interface Project {
  id: string;
  title: string;
  description: string;
  updated_at: string;
  is_public: boolean;
  xml_content?: string;
  is_favorite: boolean;
  created_at: string;
}

interface ProjectStore {
  projects: Project[];
  setProject: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updatedProject: Partial<Project>) => void;
  removeProject: (id: string) => void;
}

const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  setProject: (projects) => set({ projects }),
  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updatedProject) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, ...updatedProject } : project
      ),
    })),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
    })),
}));

export default useProjectStore;
