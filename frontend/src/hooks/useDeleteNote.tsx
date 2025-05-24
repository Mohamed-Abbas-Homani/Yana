import { useState } from "react";
import useStore from "../services/store";
import { CONSTANTS } from "../const";
import { useTranslation } from "react-i18next";

const useDeleteNote = () => {
  const { t } = useTranslation();
  const { addNotification } = useStore();
  const [loading, setLoading] = useState(false);

  const handleDeleteNote = async (noteId: any) => {
    if (!noteId) {
      addNotification("Note ID is required for deletion.", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${CONSTANTS.BackURL}/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note.");
      }

      const result = await response.json();
      addNotification(t("noteDeleted"), "success");
      return result;
    } catch (error) {
      addNotification(t("deleteError"), "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleDeleteNote,
    loading,
  };
};

export default useDeleteNote;
