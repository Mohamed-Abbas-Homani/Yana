import { invoke } from "@tauri-apps/api/core";
import { useLayoutEffect } from "react";

const useMashNotesBack = () => {
  const runBack = async () => {
    await invoke("run_mash_notes_back_sidecar");
  };
  useLayoutEffect(() => {
    runBack();
  }, []);
};

export default useMashNotesBack;
