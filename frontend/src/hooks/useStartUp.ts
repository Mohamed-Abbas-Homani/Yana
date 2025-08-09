import { useEffect, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";
import { updateCSSVariable } from "../utils/style";
import useStore from "../services/store";
import useConfig from "../services/config";
import useNoteStore from "../services/note";
import useDataPersist from "./useDataPersist";

const useStartUp = () => {
  const { i18n, t } = useTranslation();
  const { user, addNotification } = useStore();
  const { fontColor, backgroundColor, profileBackgroundColor, profileFontColor, menuItemBackground, menuToggleBackground, font } = useConfig();
  const { currentBack, currentFont } = useNoteStore();
  const { reloadData, saveData } = useDataPersist();

  useEffect(() => {
    if (user && user.name) {
      i18n.changeLanguage(user.language);
      addNotification(`${t("welcomeBack")} ${user.name}!`, "info");
    }
  }, []);

  useEffect(() => {
    updateCSSVariable("--color", fontColor);
    updateCSSVariable("--background-color", backgroundColor);
    updateCSSVariable("--current-font", currentFont);
    updateCSSVariable("--current-back", currentBack);
    updateCSSVariable("--profile-background-color", profileBackgroundColor);
    updateCSSVariable("--profile-color", profileFontColor);
    updateCSSVariable("--menu-toggle-background", menuToggleBackground);
    updateCSSVariable("--menu-item-background", menuItemBackground);
    updateCSSVariable("--font-family", font);
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

  useLayoutEffect(() => {
    const runBack = async () => {
      await invoke("run_yana_back_sidecar");
      await reloadData();
    };
    runBack();
  }, []);

  useEffect(() => {
    const exitServer = async () => {
      try {
        await saveData();
        await fetch("/yana-back-down", { method: "POST" });
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
