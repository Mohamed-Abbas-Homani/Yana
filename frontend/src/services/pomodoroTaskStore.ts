import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import notificationSound from "../assets/notification.mp3";

// Types
interface Task {
  id: string;
  text: string;
  completed: boolean;
  timeToFinish?: number; // in minutes
  createdAt: Date;
}

interface TodoList {
  id: string;
  name: string;
  tasks: Task[];
  createdAt: Date;
}

interface PomodoroSettings {
  workTime: number; // in minutes
  breakTime: number; // in minutes
  longBreakTime: number; // in minutes
  longBreakInterval: number;
}

interface PomodoroState {
  timeLeft: number; // in seconds
  isRunning: boolean;
  currentSession: "work" | "break" | "longBreak";
  completedPomodoros: number;
  lastTickTime?: number; // timestamp of last update
}

// Global timer management
export class PomodoroTimer {
  private static instance: PomodoroTimer;
  private intervalId: number | null = null;
  private store: any = null;
  private systemStore: any = null;
  private audio: HTMLAudioElement | null = null;

  static getInstance(): PomodoroTimer {
    if (!PomodoroTimer.instance) {
      PomodoroTimer.instance = new PomodoroTimer();
    }
    return PomodoroTimer.instance;
  }

  setStore(store: any, systemStore: any) {
    this.store = store;
    this.systemStore = systemStore;
  }

  initAudio() {
    if (!this.audio) {
      this.audio = new Audio(notificationSound);
      this.audio.preload = "auto";
    }
  }

  start() {
    if (this.intervalId) return; // Already running

    // Update last tick time
    if (this.store) {
      this.store.getState().setPomodoroState({
        lastTickTime: Date.now(),
        isRunning: true,
      });
    }
    this.systemStore.getState().setIsPomoOn(true);
    this.intervalId = window.setInterval(() => {
      this.tick();
    }, 1000);
  }

  pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.store) {
      this.store.getState().setPomodoroState({ isRunning: false });
      this.systemStore.getState().setIsPomoOn(false);
    }
  }

  private tick() {
    if (!this.store) return;

    const state = this.store.getState();
    const { pomodoroState } = state;

    if (!pomodoroState.isRunning) {
      this.pause();
      return;
    }

    if (pomodoroState.timeLeft > 0) {
      state.setPomodoroState({
        timeLeft: pomodoroState.timeLeft - 1,
        lastTickTime: Date.now(),
      });
    } else if (pomodoroState.timeLeft === 0) {
      // Play notification
      this.playNotification();
      // Complete pomodoro
      state.completePomodoro();
      // Continue timer for next session
      this.start();
    }
  }

  private playNotification() {
    try {
      if (this.audio) {
        this.audio.currentTime = 0;
        this.audio
          .play()
          .catch((e) => console.error("Failed to play notification:", e));
      }

      const state = this.store?.getState();
      const session = state?.pomodoroState.currentSession;
      let message = "Time to take a break!";

      if (session === "break" || session === "longBreak") {
        message = "Time to get back to work!";
      }
      this.systemStore
        .getState()
        .addNotification(
          `${this.systemStore.getState().user?.name}, ${message}`,
          "info",
        );
    } catch (error) {
      console.error("Error playing notification:", error);
    }
  }

  // Sync timer when component mounts (in case page was closed/opened)
  syncTime() {
    if (!this.store) return;

    const state = this.store.getState();
    const { pomodoroState } = state;

    if (pomodoroState.isRunning && pomodoroState.lastTickTime) {
      const now = Date.now();
      const timePassed = Math.floor((now - pomodoroState.lastTickTime) / 1000);

      if (timePassed > 0) {
        const newTimeLeft = Math.max(0, pomodoroState.timeLeft - timePassed);

        if (newTimeLeft === 0 && pomodoroState.timeLeft > 0) {
          // Timer completed while away
          this.playNotification();
          state.completePomodoro();
        } else {
          state.setPomodoroState({
            timeLeft: newTimeLeft,
            lastTickTime: now,
          });
          this.start();
        }
      }
    }
  }

  reset() {
    this.pause();
  }
}

// Store
interface Store {
  todoLists: TodoList[];
  currentListId: string | null;
  pomodoroSettings: PomodoroSettings;
  pomodoroState: PomodoroState;

  // Todo actions
  addTodoList: (name: string) => void;
  deleteTodoList: (id: string) => void;
  setCurrentList: (id: string) => void;
  addTask: (listId: string, text: string, timeToFinish?: number) => void;
  updateTask: (listId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (listId: string, taskId: string) => void;
  toggleTask: (listId: string, taskId: string) => void;

  // Pomodoro actions
  setPomodoroSettings: (settings: Partial<PomodoroSettings>) => void;
  setPomodoroState: (state: Partial<PomodoroState>) => void;
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  completePomodoro: () => void;
}

export const usePomodoroTaskStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        todoLists: [],
        currentListId: null,
        pomodoroSettings: {
          workTime: 25,
          breakTime: 5,
          longBreakTime: 15,
          longBreakInterval: 4,
        },
        pomodoroState: {
          timeLeft: 25 * 60, // 25 minutes in seconds
          isRunning: false,
          currentSession: "work",
          completedPomodoros: 0,
          lastTickTime: undefined,
        },

        addTodoList: (name: string) => {
          const newList: TodoList = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            tasks: [],
            createdAt: new Date(),
          };
          set((state) => ({
            todoLists: [...state.todoLists, newList],
            currentListId: state.currentListId || newList.id,
          }));
        },

        deleteTodoList: (id: string) => {
          set((state) => {
            const filteredLists = state.todoLists.filter(
              (list) => list.id !== id,
            );
            return {
              todoLists: filteredLists,
              currentListId:
                state.currentListId === id
                  ? filteredLists.length > 0
                    ? filteredLists[0].id
                    : null
                  : state.currentListId,
            };
          });
        },

        setCurrentList: (id: string) => {
          set({ currentListId: id });
        },

        addTask: (listId: string, text: string, timeToFinish?: number) => {
          const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            text,
            completed: false,
            timeToFinish,
            createdAt: new Date(),
          };
          set((state) => ({
            todoLists: state.todoLists.map((list) =>
              list.id === listId
                ? { ...list, tasks: [...list.tasks, newTask] }
                : list,
            ),
          }));
        },

        updateTask: (
          listId: string,
          taskId: string,
          updates: Partial<Task>,
        ) => {
          set((state) => ({
            todoLists: state.todoLists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    tasks: list.tasks.map((task) =>
                      task.id === taskId ? { ...task, ...updates } : task,
                    ),
                  }
                : list,
            ),
          }));
        },

        deleteTask: (listId: string, taskId: string) => {
          set((state) => ({
            todoLists: state.todoLists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    tasks: list.tasks.filter((task) => task.id !== taskId),
                  }
                : list,
            ),
          }));
        },

        toggleTask: (listId: string, taskId: string) => {
          set((state) => ({
            todoLists: state.todoLists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    tasks: list.tasks.map((task) =>
                      task.id === taskId
                        ? { ...task, completed: !task.completed }
                        : task,
                    ),
                  }
                : list,
            ),
          }));
        },

        setPomodoroSettings: (settings: Partial<PomodoroSettings>) => {
          set((state) => ({
            pomodoroSettings: { ...state.pomodoroSettings, ...settings },
          }));
        },

        setPomodoroState: (pomodoroState: Partial<PomodoroState>) => {
          set((state) => ({
            pomodoroState: { ...state.pomodoroState, ...pomodoroState },
          }));
        },

        startPomodoro: () => {
          const timer = PomodoroTimer.getInstance();
          timer.start();
        },

        pausePomodoro: () => {
          const timer = PomodoroTimer.getInstance();
          timer.pause();
        },

        resetPomodoro: () => {
          const state = get();
          const { currentSession } = state.pomodoroState;
          const { workTime, breakTime, longBreakTime } = state.pomodoroSettings;

          let timeLeft: number;
          switch (currentSession) {
            case "work":
              timeLeft = workTime * 60;
              break;
            case "break":
              timeLeft = breakTime * 60;
              break;
            case "longBreak":
              timeLeft = longBreakTime * 60;
              break;
            default:
              timeLeft = workTime * 60;
          }

          const timer = PomodoroTimer.getInstance();
          timer.reset();

          set((state) => ({
            pomodoroState: {
              ...state.pomodoroState,
              timeLeft,
              isRunning: false,
              lastTickTime: undefined,
            },
          }));
        },

        completePomodoro: () => {
          const state = get();
          const { completedPomodoros } = state.pomodoroState;
          const { longBreakInterval, breakTime, longBreakTime, workTime } =
            state.pomodoroSettings;

          if (state.pomodoroState.currentSession === "work") {
            const newCompletedPomodoros = completedPomodoros + 1;
            const isLongBreak = newCompletedPomodoros % longBreakInterval === 0;

            set((prevState) => ({
              pomodoroState: {
                ...prevState.pomodoroState,
                currentSession: isLongBreak ? "longBreak" : "break",
                timeLeft: (isLongBreak ? longBreakTime : breakTime) * 60,
                completedPomodoros: newCompletedPomodoros,
                isRunning: false,
                lastTickTime: Date.now(),
              },
            }));
          } else {
            set((prevState) => ({
              pomodoroState: {
                ...prevState.pomodoroState,
                currentSession: "work",
                timeLeft: workTime * 60,
                isRunning: false,
                lastTickTime: Date.now(),
              },
            }));
          }
        },
      }),
      { name: "todo-pomodoro-store" },
    ),
  ),
);
