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
    toggleMood: () => void;
};

const useNoteStore = create<NoteStore>()(
    devtools(
        persist(
            (set) => ({
                mode: "read",
                setMode: (mode: "read" | "write") => set({ mode }),

                content: "",
                setContent: (content: string) => set({ content }),

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
                // Implement toggleMood to switch between two example moods
                toggleMood: () =>
                    set((state) => ({
                        mode: state.mode === "read" ? "write" : "read",
                    })),
            }),
            { name: "mash-note-store" }
        )
    )
);

type FileNoteStore = {
    files: File[];
    setFiles: (files: File[]) => void;
    backImage: File | null;
    setBackImage: (backImage: File | null) => void;
};

export const useFileNoteStore = create<FileNoteStore>()(
    devtools(
        (set) => ({
            files: [],
            setFiles: (files: File[]) => set({ files }),
            backImage: null,
            setBackImage: (backImage: File | null) => set({ backImage }),
        })
    )
);

export default useNoteStore;