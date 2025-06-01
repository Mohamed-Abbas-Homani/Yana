import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getCSSVariable, updateCSSVariable } from "../utils/style";

type NoteStore = {
  id: string;
  setId: (id: string) => void;
  mode: "read" | "write";
  setMode: (mode: "read" | "write") => void;
  content: string;
  setContent: (content: string) => void;
  auto: boolean;
  setAuto: (auto: boolean) => void;
  showEmojie: boolean;
  setShowEmojie: (showEmojie: boolean) => void;
  currentFont: string;
  setCurrentFont: (font: string) => void;
  currentBack: string;
  setCurrentBack: (back: string) => void;
  title: string;
  setTitle: (title: string) => void;
  password: string;
  setPassword: (password: string) => void;
  tag: string;
  setTag: (tag: string) => void;
  mood: string;
  setMood: (mood: string) => void;
  toggleMode: () => void;
  reset: () => void;
  history: string[];
  future: string[];
  undo: () => void;
  redo: () => void;
};

const useNoteStore = create<NoteStore>()(
  devtools(
    persist(
      (set, get) => ({
        mode: "read",
        setMode: (mode: "read" | "write") => set({ mode }),

        content: "",
        history: [],
        future: [],

        setContent: (newContent: string) => {
          const { content, history } = get();
          if (newContent !== content) {
            const updatedHistory = [...history, content];
            const limitedHistory = updatedHistory.slice(-100)// Keep only last 100
            set({
              content: newContent,
              history: limitedHistory,
              future: [],
            });
          }
        },

        undo: () => {
          const { history, content, future } = get();
          if (history.length === 0) return;
          const previous = history[history.length - 1];
          const newHistory = history.slice(0, -1);
          set({
            content: previous,
            history: newHistory,
            future: [content, ...future],
          });
        },

        redo: () => {
          const { history, content, future } = get();
          if (future.length === 0) return;
          const next = future[0];
          const newFuture = future.slice(1);
          set({
            content: next,
            history: [...history, content],
            future: newFuture,
          });
        },

        id: "",
        setId: (id: string) => set({ id }),

        auto: false,
        setAuto: (auto: boolean) => set({ auto }),

        showEmojie: false,
        setShowEmojie: (showEmojie: boolean) => set({ showEmojie }),

        currentFont: getCSSVariable("--current-font") || "#e9e9e9",
        setCurrentFont: (font: string) => {
          set({ currentFont: font });
          updateCSSVariable("--current-font", font);
        },

        currentBack: getCSSVariable("--current-back") || "#222",
        setCurrentBack: (back: string) => {
          set({ currentBack: back });
          updateCSSVariable("--current-back", back);
        },

        title: "",
        setTitle: (title: string) => set({ title }),

        password: "",
        setPassword: (password: string) => set({ password }),

        tag: "",
        setTag: (tag: string) => set({ tag }),

        mood: "",
        setMood: (mood: string) => set({ mood }),
        // Implement toggleMode to switch between two example moods
        toggleMode: () =>
          set((state) => ({
            mode: state.mode === "read" ? "write" : "read",
          })),

        reset: () =>
          set({
            mode: "read",
            content: "",
            id: "",
            auto: false,
            showEmojie: false,
            currentFont: getCSSVariable("--current-font") || "#e9e9e9",
            currentBack: getCSSVariable("--current-back") || "#222",
            title: "",
            password: "",
            tag: "",
            mood: "",
          }),
      }),
      { name: "yana-editor-store" }
    )
  )
);

type FileNoteStore = {
  files: File[];
  setFiles: (files: File[]) => void;
  backImage: File | null;
  setBackImage: (backImage: File | null) => void;
  reset: () => void;
};

export const useFileNoteStore = create<FileNoteStore>()(
  devtools((set) => ({
    files: [],
    setFiles: (files: File[]) => set({ files }),
    backImage: null,
    setBackImage: (backImage: File | null) => set({ backImage }),
    reset: () => set({ files: [], backImage: null }),
  }))
);

type DisplayNote = {
  id: string;
  title: string;
  password: string;
  content: string;
  tag: string;
  mood: string;
  fcolor: string;
  bcolor: string;
  bpicture: File;
  createdAt: string;
};

type NotesDisplayStore = {
  notes: DisplayNote[];
  setNotes: (notes: DisplayNote[]) => void;
  page: number;
  setPage: (page: number) => void;
  total: number;
  setTotal: (total: number) => void;
  filters: string[];
  setFilters: (filters: string[]) => void;
  toggleFilter: (filter: string) => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
};

export const useNotesDisplayStore = create<NotesDisplayStore>()(
  devtools((set) => ({
    notes: [],
    setNotes: (notes: DisplayNote[]) => set({ notes }),

    page: 1,
    setPage: (page: number) => set({ page }),
    total: 1,
    setTotal: (total: number) => set({ total }),
    keyword: "",
    setKeyword: (keyword: string) => set({ keyword }),

    filters: [],
    setFilters: (filters: string[]) => set({ filters }),

    toggleFilter: (filter: string) =>
      set((state) => ({
        filters: state.filters.includes(filter)
          ? state.filters.filter((f) => f !== filter)
          : [...state.filters, filter],
      })),
  }))
);

export default useNoteStore;
