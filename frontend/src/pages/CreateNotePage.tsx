import Page from "../components/UI/Page";
import "../components/CreateNote/CreateNote.css";
import "katex/dist/katex.min.css";
import { useCallback, useState, useEffect, useRef } from "react";
import { debounce } from "../utils/functions";
import MarkdownEditor from "../components/CreateNote/MarkDownEditor/MarkdownEditor";
import TopBar from "../components/CreateNote/TopBar/TopBar";
import useConfig from "../services/config";
import SideBar from "../components/CreateNote/SideBar/SideBar";
import DateTimePicker from "../components/CreateNote/DateTimePicker/DateTimePicker";
const CreateNotePage = () => {
  const [mode, setMode] = useState<"read" | "write">("read");
  const [content, setContent] = useState<string>("");
  const [auto, setAuto] = useState<boolean>(false);
  const [showEmojie, setShowEmojie] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null); // Store image URL
  const emojiPickerRef = useRef<any>(null); // Create ref for the emoji picker container
  const { currentFont, currentBack, setCurrentFont, setCurrentBack } =
    useConfig();

  const debouncedSetMode = useCallback(
    debounce(() => setMode("read"), 3000),
    []
  );

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.currentTarget.value);
    if (auto) debouncedSetMode();
  };

  // Handle key press (spacebar) for mode switch in read mode
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === " " && mode === "read") {
      setMode("write");
      setTimeout(() => {
        const inputElement = inputRef.current;
        if (inputElement && inputElement instanceof HTMLTextAreaElement) {
          inputElement.focus();
          inputElement.setSelectionRange(
            inputElement.value.length,
            inputElement.value.length
          );
        }
      }, 0);
    }
  };

  // Add event listener for space key press when component is mounted
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mode]);

  // Close emoji picker if click is outside the picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojie(false); // Close emoji picker if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Image upload handler
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file); // Generate URL for uploaded image
      setImageURL(imageURL); // Store image URL to pass to MarkdownEditor
    }
  };
  // Insert emoji at the cursor position in the content
  const handleEmojiSelect = (emojiData: any) => {
    const inputElement = inputRef.current;
    if (inputElement) {
      const start = inputElement.selectionStart;
      const end = inputElement.selectionEnd;
      const updatedText =
        content.slice(0, start) + emojiData.emoji + content.slice(end);
      setContent(updatedText);

      // Set focus back to the input and update the cursor position
      setTimeout(() => {
        inputElement.focus();
        inputElement.setSelectionRange(
          start + emojiData.emoji.length,
          start + emojiData.emoji.length
        );
      }, 0);

      setShowEmojie(false); // Hide emoji picker after selection
    }
  };

  return (
    <Page>
      <div className="create-note-container">
        <div className="create-note-container-top">
          <div
            className="create-note-container-internal"
            onDoubleClick={() => {
              setMode((prev) => (prev === "read" ? "write" : "read"));
              setTimeout(() => {
                const inputElement = inputRef.current;
                if (
                  inputElement &&
                  inputElement instanceof HTMLTextAreaElement
                ) {
                  inputElement.focus();
                  inputElement.setSelectionRange(
                    inputElement.value.length,
                    inputElement.value.length
                  );
                }
              }, 0);
            }}
          >
            <TopBar
              mode={mode}
              setMode={setMode}
              inputRef={inputRef}
              auto={auto}
              setAuto={setAuto}
              content={content}
              setContent={setContent}
            />
            <div className="bottom-body">
              <SideBar
                currentFont={currentFont}
                setCurrentFont={setCurrentFont}
                currentBack={currentBack}
                setCurrentBack={setCurrentBack}
                setImageURL={setImageURL}
                showEmojie={showEmojie}
                setShowEmojie={setShowEmojie}
                content={content}
                setContent={setContent}
                inputRef={inputRef}
                emojiPickerRef={emojiPickerRef}
                handleImageUpload={handleImageUpload}
                handleEmojiSelect={handleEmojiSelect}
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
          <div className="create-note-container-detail">
            <div className="detail-input">
              <input type="text" required id="title" name="title" />
              <label htmlFor="title">Title</label>
            </div>
            <div className="detail-input">
              <input type="password" required id="password" name="password" />
              <label htmlFor="title">Password</label>
            </div>
            <DateTimePicker />
          </div>
        </div>
        <div className="create-note-container-bottom">.</div>
      </div>
    </Page>
  );
};

export default CreateNotePage;
