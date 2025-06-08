import { useEffect, useState } from "react";
import { CONSTANTS } from "../const";
import { useNotesDisplayStore } from "../services/note";

const fetchDocument = async (documentId: string): Promise<File> => {
  try {
    const response = await fetch(
      `${CONSTANTS.BackURL}/documents/${documentId}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch document with ID ${documentId}`);
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = "default_filename";

    if (contentDisposition && contentDisposition.includes("filename=")) {
      filename = contentDisposition
        .split("filename=")[1]
        .replace(/"/g, "")
        .trim();
    }

    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};

const useFetchNotes = () => {
  const {
    notes,
    setNotes,
    page,
    filters,
    keyword,
    setPage,
    setKeyword,
    setTotal,
  } = useNotesDisplayStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);

      try {
        const filterString = filters
          .map((f: string) => f.toLowerCase())
          .join(",");
        const url = `${CONSTANTS.BackURL}/notes?keyword=${keyword}&filter=${filterString}&page=${page}&size=6`;
        console.log(url, filterString)
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch notes.");
        }

        const data = await response.json();
        if (!data.notes) {
          setNotes([]);
          setTotal(0);
        } else {
          const fetchedNotes = await Promise.all(
            data.notes?.map(async (note: any) => {
              if (note.bPictureId) {
                note.bpicture = await fetchDocument(note.bPictureId);
              }
              return note;
            }),
          );
          setTotal(data.totalRecords);
          setNotes(fetchedNotes ?? []);
        }
      } catch (err) {
        setError(`An error occurred while fetching notes. ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [page, filters, keyword]);

  return { notes, loading, error, setPage, setError, setKeyword };
};

export default useFetchNotes;
