import { create } from "zustand";

interface NestedPoint {
  heading: string;
  points: Array<string | NestedPoint>; // Recursive type for deeply nested points
}

interface Slide {
  content: {
    style: string;
    heading: string;
    key_message: string;
    body: {
      points: Array<string | NestedPoint>; // Updated to handle nested points for any style
    };
    img_keywords: string[];
  };
  img_url: string;
  slide_number: number;
  id: string;
}

interface SlidesState {
  slides: Slide[];
  title: string;
  setSlides: (slides: Slide[]) => void;
  setTitle: (title: string) => void;
  updateSlide: (index: number, updatedSlide: Slide) => void; // Update an individual slide
  addSlide: (slide: Slide) => void; // Add a new slide
  deleteSlide: (index: number) => void; // Delete a specific slide
}

const useSlidesStore = create<SlidesState>((set) => ({
  slides: [],
  title: "",
  setSlides: (slides) => set({ slides }),
  setTitle: (title) => set({ title }),
  // Method to update a specific slide by index
  updateSlide: (index, updatedSlide) =>
    set((state) => {
      const updatedSlides = [...state.slides];
      updatedSlides[index] = updatedSlide;
      return { slides: updatedSlides };
    }),

  // Method to add a new slide
  addSlide: (slide) =>
    set((state) => ({
      slides: [...state.slides, slide],
    })),

  // Method to delete a specific slide by index
  deleteSlide: (index) =>
    set((state) => ({
      slides: state.slides.filter((_, idx) => idx !== index),
    })),
}));

export default useSlidesStore;
