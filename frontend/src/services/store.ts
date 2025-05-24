// store/notificationStore.ts
import { create } from "zustand";
import { Notification } from "../types/Notification";
import { User } from "../types/User";
import { devtools, persist } from "zustand/middleware";

type Store = {
  notifications: Notification[];
  addNotification: (
    message: string,
    type: "success" | "error" | "info",
  ) => void;
  removeNotification: (id: number) => void;
  user: User | null;
  setUser: (user: User) => void;
  cmenuStatus: string;
  setCMenuStatus: (cmenuStatus: string) => void;
  userAction: string;
  setUserAction: (userAction: string) => void;
  lastPage: string;
  setLastPage: (lastPage: string) => void;
};

const useStore = create<Store>()(
  devtools(
    persist(
      (set) => ({
        notifications: [],
        user: null,
        cmenuStatus: "hide",
        userAction: "neutral",
        lastPage: "/",
        addNotification: (message, type) => {
          const id = Math.random(); // Generate a unique ID for the notification
          set((state) => ({
            notifications: [...state.notifications, { id, message, type }],
          }));

          // Automatically remove the notification after a certain duration
          setTimeout(() => {
            set((state) => ({
              notifications: state.notifications.filter(
                (note) => note.id !== id,
              ),
            }));
          }, 3400);
        },
        removeNotification: (id) => {
          set((state) => ({
            notifications: state.notifications.filter((note) => note.id !== id),
          }));
        },
        setUser: (user: User) => {
          set({ user });
        },
        setCMenuStatus: (cmenuStatus: string) => {
          set({ cmenuStatus });
        },
        setUserAction: (userAction: string) => {
          set({ userAction });
        },
        setLastPage: (lastPage: string) => {
          set({ lastPage });
        },
      }),
      { name: "mash-store" },
    ),
  ),
);

export default useStore;
