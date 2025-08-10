// hooks/useDataPersist.ts
import { CONSTANTS } from "../const";
import useConfig from "../services/config";
import useNoteStore from "../services/note";
import useStore from "../services/store";
import { usePomodoroTaskStore } from "../services/pomodoroTaskStore";
import useWhiteboardStore from "../services/whiteBaordStore";

export default function useDataPersist() {
  const reloadData = async () => {
    const configStore = await getConfigByKey("yana-config-store");
    const noteStore = await getConfigByKey("yana-editor-store");
    const userStore = await getConfigByKey("yana-store");
    const pomodoroStore = await getConfigByKey("todo-pomodoro-store");
    const whiteboardStore = await getConfigByKey("whiteboard-store");
    if (noteStore?.value) useNoteStore.setState(noteStore.value);
    if (userStore?.value) useStore.setState(userStore.value);
    if (pomodoroStore?.value) usePomodoroTaskStore.setState(pomodoroStore.value);
    if (whiteboardStore?.value) useWhiteboardStore.setState(whiteboardStore.value);
    if (configStore?.value) useConfig.setState(configStore.value);
  };

  const saveData = async () => {
    await createConfig("yana-editor-store", useNoteStore.getState());
    await createConfig("yana-store", useStore.getState());
    await createConfig("todo-pomodoro-store", usePomodoroTaskStore.getState());
    await createConfig("whiteboard-store", useWhiteboardStore.getState());
    await createConfig("yana-config-store", useConfig.getState());
  };

  return { reloadData, saveData };
}

async function getConfigByKey<T = any>(key: string): Promise<{ id: string; value: T }> {
  const res = await fetch(`${CONSTANTS.BackURL}/config/${encodeURIComponent(key)}`);

  if (!res.ok) {
    throw new Error(`Failed to get config: ${res.status}`);
  }

  const data: { id: string; value: string } = await res.json();

  let parsedValue: T;
  try {
    parsedValue = JSON.parse(data.value);
  } catch {
    parsedValue = data.value as unknown as T;
  }

  return { ...data, value: parsedValue };
}

async function createConfig(key: string, value: unknown): Promise<{ id: string; value: string }> {
  const res = await fetch(`${CONSTANTS.BackURL}/config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key,
      value: JSON.stringify(value),
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create config: ${res.status}`);
  }

  return res.json();
}
