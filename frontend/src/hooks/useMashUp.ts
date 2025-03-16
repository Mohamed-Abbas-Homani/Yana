import { useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { listen } from '@tauri-apps/api/event';
import { appDataDir } from '@tauri-apps/api/path';
import { CONSTANTS } from '../const';

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
    console.error('Error exiting the server:', err.message);
  }
};

const useMashUp = (): void => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataPath = await appDataDir();
        if (!dataPath) {
          console.error('Data path is undefined.');
          return;
        }

        const response = await fetch(`${CONSTANTS.BackURL}/mash-up`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: dataPath,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        console.log('API call was successful');
      } catch (err: any) {
        console.error('API call failed:', err.message);
      }
    };

    fetchData();

    // Listen for the close event to shut down the server
    const unlisten = listen('tauri://close-requested', async () => {
      console.log('Window is closing, shutting down the server...');
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
