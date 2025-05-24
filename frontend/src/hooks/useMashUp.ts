import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";
import { CONSTANTS } from "../const";

const exitServer = async () => {
  try {
    const response = await fetch(`${CONSTANTS.BackURL}/mash-down`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.message); // "Server is shutting down"
  } catch (err: any) {
    console.error("Error exiting the server:", err.message);
  }
};

const useMashUp = (): void => {
  useEffect(() => {
    // Listen for the close event to shut down the server
    const unlisten = listen("tauri://close-requested", async () => {
      console.log("Window is closing, shutting down the server...");
      await exitServer();
      // Close the window only after the server shuts down
      await getCurrentWindow().close();
    });

    return () => {
      // Clean up the event listener when the component unmounts
      unlisten.then((off) => off());
    };
  }, []);
};

export default useMashUp;
