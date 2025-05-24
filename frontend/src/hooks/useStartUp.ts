import { useEffect } from "react";
import useConfig from "../services/config";
import useMashNotesBack from "./useMashNotesBack";
import useMashUp from "./useMashUp";
import { updateCSSVariable } from "../utils/style";
import useNoteStore from "../services/note.ts";
import useStore from "../services/store.ts";
import { useTranslation } from "react-i18next";

const useStartUp = () => {
  const { i18n, t } = useTranslation();
  const { user, addNotification } = useStore();
  useEffect(() => {
    if (user && user.name) {
      i18n.changeLanguage(user.language);
      addNotification(`${t("welcomeBack")} ${user.name}!`, "info");
    }
  }, []);
  const {
    fontColor,
    backgroundColor,
    profileBackgroundColor,
    profileFontColor,
    menuItemBackground,
    menuToggleBackground,
  } = useConfig();
  const { currentBack, currentFont } = useNoteStore();
  useEffect(() => {
    updateCSSVariable("--color", fontColor);
    updateCSSVariable("--background-color", backgroundColor);
    updateCSSVariable("--current-font", currentFont);
    updateCSSVariable("--current-back", currentBack);
    updateCSSVariable("--profile-background-color", profileBackgroundColor);
    updateCSSVariable("--profile-color", profileFontColor);
    updateCSSVariable("--menu-toggle-background", menuToggleBackground);
    updateCSSVariable("--menu-item-background", menuItemBackground);
  }, []);
  useMashNotesBack();
  useMashUp();
};
export default useStartUp;
