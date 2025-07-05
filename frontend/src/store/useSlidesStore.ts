import { create } from "zustand";

interface XMLSlide {
  content: {
    heading: string;
    layout_type?: string;
    section_layout?: string;
    bullets?: any;
    img_queries?: string[];
    // Legacy support
    style?: string;
    key_message?: string;
    body?: {
      points: Array<string | any>;
    };
    img_keywords?: string[];
  };
  img_url?: string;
  slide_number: number;
  id: string;
  dominant_color: string;
  xml_content: string;
  layout_type: string;
  section_layout: string;
}

interface SlidesState {
  slides: XMLSlide[];
  title: string;
  is_public: boolean;
  setSlides: (slides: XMLSlide[]) => void;
  setTitle: (title: string) => void;
  setPublic: (is_public: boolean) => void;
  updateSlide: (index: number, updatedSlide: XMLSlide) => void;
  addSlide: (slide: XMLSlide) => void;
  deleteSlide: (index: number) => void;
}

const useSlidesStore = create<SlidesState>((set) => ({
  slides: [],
  title: "",
  is_public: false,
  setSlides: (slides) => set({ slides }),
  setTitle: (title) => set({ title }),
  setPublic: (is_public) => set({ is_public }),
  updateSlide: (index, updatedSlide) =>
    set((state) => {
      const updatedSlides = [...state.slides];
      updatedSlides[index] = updatedSlide;
      return { slides: updatedSlides };
    }),
  addSlide: (slide) =>
    set((state) => ({
      slides: [...state.slides, slide],
    })),
  deleteSlide: (index) =>
    set((state) => ({
      slides: state.slides.filter((_, idx) => idx !== index),
    })),
}));

export default useSlidesStore;
