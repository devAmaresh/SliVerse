// src/store/useSlidesStore.ts
import { create } from "zustand";

interface Slide {
  heading: string;
  key_message?: string;
  bullet_points?: string[];
}

interface SlidesState {
  slides: Slide[];
  setSlides: (slides: Slide[]) => void;
}

const useSlidesStore = create<SlidesState>((set) => ({
  slides: [],
  setSlides: (slides) => set({ slides }),
}));

export default useSlidesStore;
