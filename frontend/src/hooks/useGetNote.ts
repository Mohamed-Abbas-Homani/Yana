import { useState, useEffect } from "react";
import useNoteStore, { useFileNoteStore } from "../services/note";
import useStore from "../services/store";
import { useParams } from "react-router-dom";
import { CONSTANTS } from "../const";
import { useTranslation } from "react-i18next";

const useGetNote = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user, addNotification } = useStore();
  const {
    setId,
    setContent,
    setTitle,
    setTag,
    setMood,
    setPassword,
    setCurrentFont,
    setCurrentBack,
  } = useNoteStore();
  const { setFiles, setBackImage } = useFileNoteStore();
  const [loading, setLoading] = useState(false);

  const fetchDocument = async (documentId: string): Promise<File> => {
    try {
      const response = await fetch(
        `${CONSTANTS.BackURL}/documents/${documentId}`,
      );

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`Failed to fetch document with ID ${documentId}`);
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Extract the filename from the Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "default_filename"; // Fallback filename

      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = contentDisposition
          .split("filename=")[1]
          .replace(/"/g, "")
          .trim();
      }

      // Create and return the File object
      const file = new File([blob], filename, { type: blob.type });
      return file;
    } catch (error) {
      console.error("Error fetching document:", error);
      throw error; // Re-throw the error for the caller to handle
    }
  };

  useEffect(() => {
    if (!user || !id) return;

    const fetchNote = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${CONSTANTS.BackURL}/note/${id}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch note.");
        }

        const noteData = await response.json();

        // Set the note data into the store
        setId(id);
        setContent(noteData.content);
        setTitle(noteData.title);
        setTag(noteData.tag);
        setMood(noteData.mood);
        setPassword(noteData.password || "");
        setCurrentFont(noteData.fColor);
        setCurrentBack(noteData.bColor);

        // Fetch documents by IDs
        if (noteData.documents && noteData.documents.length > 0) {
          const files = await Promise.all(
            noteData.documents.map(async (documentId: any) => {
              const file = await fetchDocument(documentId);
              return file;
            }),
          );
          setFiles(files); // Set files in the store
        }

        // Fetch the background image by ID
        if (noteData.bPicture) {
          const bPictureFile = await fetchDocument(noteData.bPicture);
          setBackImage(bPictureFile); // Set the background image in the store
        }

        addNotification(t("noteLoaded"), "success");
      } catch (error) {
        addNotification(t("fetcherror"), "error");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, user]);

  return {
    loading,
  };
};

export default useGetNote;
