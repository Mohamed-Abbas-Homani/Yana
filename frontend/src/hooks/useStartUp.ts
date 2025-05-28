import { useEffect, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";
import { CONSTANTS } from "../const";
import useConfig from "../services/config";
import useNoteStore from "../services/note.ts";
import useStore from "../services/store.ts";
import { updateCSSVariable } from "../utils/style";

const useStartUp = () => {
  const { i18n, t } = useTranslation();
  const { user, addNotification } = useStore();
  const {
    fontColor,
    backgroundColor,
    profileBackgroundColor,
    profileFontColor,
    menuItemBackground,
    menuToggleBackground,
  } = useConfig();
  const { currentBack, currentFont } = useNoteStore();

  // Welcome message and language setup
  useEffect(() => {
    if (user && user.name) {
      i18n.changeLanguage(user.language);
      addNotification(`${t("welcomeBack")} ${user.name}!`, "info");
    }
  }, []);

  // CSS variable setup
  useEffect(() => {
    updateCSSVariable("--color", fontColor);
    updateCSSVariable("--background-color", backgroundColor);
    updateCSSVariable("--current-font", currentFont);
    updateCSSVariable("--current-back", currentBack);
    updateCSSVariable("--profile-background-color", profileBackgroundColor);
    updateCSSVariable("--profile-color", profileFontColor);
    updateCSSVariable("--menu-toggle-background", menuToggleBackground);
    updateCSSVariable("--menu-item-background", menuItemBackground);
  }, [
    fontColor,
    backgroundColor,
    currentFont,
    currentBack,
    profileBackgroundColor,
    profileFontColor,
    menuToggleBackground,
    menuItemBackground,
  ]);

  // Run backend sidecar
  useLayoutEffect(() => {
    const runBack = async () => {
      await invoke("run_yana_back_sidecar");
    };
    runBack();
  }, []);

  // Graceful shutdown
  useEffect(() => {
    const exitServer = async () => {
      try {
        const response = await fetch(`${CONSTANTS.BackURL}/mash-down`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        await response.json();
      } catch (err: any) {
        console.error("Error exiting the server:", err.message);
      }
    };

    const unlisten = listen("tauri://close-requested", async () => {
      await exitServer();
      await getCurrentWindow().close();
    });

    return () => {
      unlisten.then((off) => off());
    };
  }, []);
};

export default useStartUp;
