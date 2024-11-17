import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getCSSVariable, updateCSSVariable } from "../utils/style";

type Store = {
  fontColor: string;
  setFontColor: (color: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  currentFont: string;
  setCurrentFont: (font: string) => void;
  currentBack: string;
  setCurrentBack: (back: string) => void;
};

const useConfig = create<Store>()(
  devtools(
    persist(
      (set) => ({
        // Initialize the state with the current values of the CSS variables
        fontColor: getCSSVariable("--color") || "#e9e9e9", // Default to a fallback color
        backgroundColor: getCSSVariable("--background-color") || "#222", // Default to a fallback background color
        currentFont: getCSSVariable("--current-font") || "#e9e9e9", // Default to a fallback font
        currentBack: getCSSVariable("--current-back") || "#222", // Default to a fallback background

        // Functions to update CSS variables and store state
        setFontColor: (color: string) => {
          set({ fontColor: color });
          updateCSSVariable("--color", color); // Update CSS variable
        },
        setBackgroundColor: (color: string) => {
          set({ backgroundColor: color });
          updateCSSVariable("--background-color", color); // Update CSS variable
        },
        setCurrentFont: (font: string) => {
          set({ currentFont: font });
          updateCSSVariable("--current-font", font); // Update CSS variable
        },
        setCurrentBack: (back: string) => {
          set({ currentBack: back });
          updateCSSVariable("--current-back", back); // Update CSS variable
        },
      }),
      { name: "mash-config-store" }
    )
  )
);

export default useConfig;
