import { useState } from "react";
import useNoteStore, { useFileNoteStore } from "../services/note";
import useStore from "../services/store";
const useNoteHandler = () => {
  const { user, addNotification } = useStore();
  const {
    id,
    content,
    title,
    tag,
    mood,
    password,
    currentFont,
    currentBack,

  } = useNoteStore();
  const { files, backImage } = useFileNoteStore()
  const [loading, setLoading] = useState(false);

  const handleNoteSubmission = async () => {
    if (!user) {
      return;
    }

    const formData = new FormData();
    if (id) {
      formData.append("id", id);

    }
    formData.append("user_id", String(user.id));
    formData.append("content", content);
    formData.append("title", title);
    formData.append("tag", tag);
    formData.append("mood", mood);
    formData.append("fColor", currentFont);
    formData.append("bColor", currentBack);

    if (password) {
      formData.append("password", password);
    }
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("documents", file, file.name);
      });
    }

    if (backImage) {
      formData.append("bPicture", backImage, backImage.name);
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/note`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit note.");
      }

      const result = await response.json();
      addNotification("Note saved successfully!", "success");
      return result;
    } catch (error) {
      addNotification("An error occurred while saving the note :(", "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleNoteSubmission,
    loading,
  };
};

export default useNoteHandler;
