import Page from "../components/UI/Page";
import "../components/CreateNote/CreateNote.css";
import "katex/dist/katex.min.css";
import { useCallback, useState, useEffect, useRef } from "react";
import { debounce } from "../utils/functions";
import MarkdownEditor from "../components/CreateNote/MarkDownEditor/MarkdownEditor";
import TopBar from "../components/CreateNote/TopBar/TopBar";
import SideBar from "../components/CreateNote/SideBar/SideBar";
import Details from "../components/CreateNote/Details/Details.tsx";
import BottomBar from "../components/CreateNote/BottomBar/BottomBar.tsx";
import useNoteStore, { useFileNoteStore } from "../services/note.ts";
import useStore from "../services/store.ts";
import { useLocation } from "react-router-dom";
import useGetNote from "../hooks/useGetNote.ts";

const CreateNotePage = () => {
  useGetNote();
  const location = useLocation();
  const { setUserAction, setLastPage } = useStore();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const { backImage, setBackImage } = useFileNoteStore();
  const emojiPickerRef = useRef<any>(null);
  const {
    auto,
    setShowEmojie,
    content,
    setContent,
    mode,
    setMode,
    toggleMood,
  } = useNoteStore();

  const debouncedSetMode = useCallback(
    debounce(() => setMode("read"), 3000),
    [],
  );

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.currentTarget.value);
    if (auto) debouncedSetMode();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === " " && mode === "read") {
      setMode("write");
      setTimeout(() => {
        const inputElement = inputRef.current;
        if (inputElement && inputElement instanceof HTMLTextAreaElement) {
          inputElement.focus();
          inputElement.setSelectionRange(
            inputElement.value.length,
            inputElement.value.length,
          );
        }
      }, 0);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mode]);

  useEffect(() => {
    setLastPage(location.pathname);
    setUserAction("editingNote");
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojie(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Image upload handler
  const handleBackImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setBackImage(file);
    }
  };

  useEffect(() => {
    if (backImage) {
      const imageUrl = URL.createObjectURL(backImage);
      setImageURL(imageUrl);
    }
  }, [backImage]);

  // Insert emoji at the cursor position in the content
  const handleEmojiSelect = (emojiData: any) => {
    const inputElement = inputRef.current;
    if (inputElement) {
      const start = inputElement.selectionStart;
      const end = inputElement.selectionEnd;
      const updatedText =
        content.slice(0, start) + emojiData.emoji + content.slice(end);
      setContent(updatedText);
    }
  };
  return (
    <Page>
      <div className="create-note-container">
        <div className="create-note-container-top">
          <div
            className="create-note-container-internal"
            onDoubleClick={() => {
              toggleMood();
              setTimeout(() => {
                const inputElement = inputRef.current;
                if (
                  inputElement &&
                  inputElement instanceof HTMLTextAreaElement
                ) {
                  inputElement.focus();
                  inputElement.setSelectionRange(
                    inputElement.value.length,
                    inputElement.value.length,
                  );
                }
              }, 0);
            }}
          >
            <TopBar
              inputRef={inputRef}
              content={content}
              setContent={setContent}
            />
            <div className="bottom-body">
              <SideBar
                setImageURL={setImageURL}
                setBackImage={setBackImage}
                content={content}
                setContent={setContent}
                inputRef={inputRef}
                emojiPickerRef={emojiPickerRef}
                handleEmojiSelect={handleEmojiSelect}
                handleImageUpload={handleBackImageUpload}
              />
              <MarkdownEditor
                mode={mode}
                content={content}
                inputRef={inputRef}
                handleChange={handleChange}
                imageURL={imageURL}
              />
            </div>
          </div>
          <Details />
        </div>
        <BottomBar />
      </div>
    </Page>
  );
};

export default CreateNotePage;
