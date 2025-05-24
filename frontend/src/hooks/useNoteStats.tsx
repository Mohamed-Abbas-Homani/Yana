import { useState, useEffect } from "react";
import axios from "axios";
import { CONSTANTS } from "../const";

interface NoteStats {
  createdNotes: { [key: string]: number }; // Creation stats by weekday
  moodNotes: { [key: string]: number }; // Notes stats by mood
  loading: boolean;
  error: string | null;
}

export const useNoteStats = () => {
  const [noteStats, setNoteStats] = useState<NoteStats>({
    createdNotes: {},
    moodNotes: {},
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [creationRes, moodRes] = await Promise.all([
          axios.get(`${CONSTANTS.BackURL}/notes/creation-stat`),
          axios.get(`${CONSTANTS.BackURL}/notes/mood-stat`),
        ]);

        setNoteStats({
          createdNotes: creationRes.data, // Data for created notes per weekday
          moodNotes: moodRes.data, // Data for mood-based notes
          loading: false,
          error: null,
        });
      } catch (error) {
        setNoteStats({
          createdNotes: {},
          moodNotes: {},
          loading: false,
          error: "Failed to load note statistics.",
        });
      }
    };

    fetchStats();
  }, []);

  return noteStats;
};
