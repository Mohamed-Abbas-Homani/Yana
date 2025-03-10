import { useEffect } from "react";
import useConfig from "../services/config";
import useMashNotesBack from "./useMashNotesBack";
import useMashUp from "./useMashUp";
import { updateCSSVariable } from "../utils/style";
import useNoteStore from "../services/note.ts";
import useStore from "../services/store.ts";

const useStartUp = () => {
  const {user,addNotification } = useStore();
  useEffect(() => {
    if (user && user.name) {
      addNotification(`Welcome Back ${user.name}!`, "info");

    }
  }, []);
  const { fontColor, backgroundColor} = useConfig();
  const {currentBack, currentFont } = useNoteStore()
  useEffect(() => {
    updateCSSVariable("--color", fontColor);
    updateCSSVariable("--background-color", backgroundColor);
    updateCSSVariable("--current-font", currentFont);
    updateCSSVariable("--current-back", currentBack);
  }, []);
  useMashNotesBack();
  useMashUp();
};
export default useStartUp;
