import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getCSSVariable, updateCSSVariable } from "../utils/style";

type Store = {
  fontColor: string;
  setFontColor: (color: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  profileFontColor: string;
  setProfileFontColor: (color: string) => void;
  profileBackgroundColor: string;
  setProfileBackgroundColor: (color: string) => void;
  menuItemBackground: string;
  setMenuItemBackground: (color: string) => void;
  menuToggleBackground: string;
  setMenuToggleBackground: (color: string) => void;
};

const useConfig = create<Store>()(
  devtools(
    persist(
      (set) => ({
        // Initialize the state with the current values of the CSS variables
        fontColor: getCSSVariable("--color") || "#e9e9e9", // Default to a fallback color
        backgroundColor: getCSSVariable("--background-color") || "#222", // Default to a fallback background color
        profileFontColor: getCSSVariable("--profile-color") || "#e9e9e9", // Default profile font color
        profileBackgroundColor:
          getCSSVariable("--profile-background-color") || "#222", // Default profile background color
        menuItemBackground: getCSSVariable("--menu-item-background") || "#444", // Default menu item background color
        menuToggleBackground:
          getCSSVariable("--menu-toggle-background") || "#555", // Default menu toggle background color

        // Functions to update CSS variables and store state
        setFontColor: (color: string) => {
          set({ fontColor: color });
          updateCSSVariable("--color", color); // Update CSS variable for global font color
        },
        setBackgroundColor: (color: string) => {
          set({ backgroundColor: color });
          updateCSSVariable("--background-color", color); // Update CSS variable for global background color
        },
        setProfileFontColor: (color: string) => {
          set({ profileFontColor: color });
          updateCSSVariable("--profile-color", color); // Update CSS variable for profile font color
        },
        setProfileBackgroundColor: (color: string) => {
          set({ profileBackgroundColor: color });
          updateCSSVariable("--profile-background-color", color); // Update CSS variable for profile background color
        },
        setMenuItemBackground: (color: string) => {
          set({ menuItemBackground: color });
          updateCSSVariable("--menu-item-background", color); // Update CSS variable for menu item background
        },
        setMenuToggleBackground: (color: string) => {
          set({ menuToggleBackground: color });
          updateCSSVariable("--menu-toggle-background", color); // Update CSS variable for menu toggle background
        },
      }),
      { name: "mash-config-store" },
    ),
  ),
);

export default useConfig;
