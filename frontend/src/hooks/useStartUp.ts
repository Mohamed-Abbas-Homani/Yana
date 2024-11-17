import { useEffect } from "react";
import useConfig from "../services/config";
import useMashNotesBack from "./useMashNotesBack";
import useMashUp from "./useMashUp";
import { updateCSSVariable } from "../utils/style";

const useStartUp = () => {
  const { fontColor, backgroundColor, currentBack, currentFont } = useConfig();
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
