import { MdEmojiEmotions, MdContentCopy, MdContentPaste } from "react-icons/md";
import { FaImage } from "react-icons/fa6";
import EmojiPicker from "emoji-picker-react";
import { writeText, readText } from "@tauri-apps/plugin-clipboard-manager";
import { useTranslation } from "react-i18next";
import "./SideBar.css";
import useNoteStore from "../../../services/note.ts";
import styled from "styled-components";

// ✅ Make this a styled <label> so it triggers the input inside on click
const ColorWrapper = styled.label<{ color: string; border?: boolean }>`
  display: inline-block;
  width: 1.31rem;
  height: 1.31rem;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  cursor: pointer;
  margin: 0.81rem 0;
  transition: all 0.34s;
  border: ${({ border }) => (border ? "0.1rem solid var(--color)" : "none")};
  position: relative;

  input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    border-radius: 50%;
  }
`;
interface SideBarProps {
  setImageURL: (url: string | null) => void;
  setBackImage: (image: any) => void;
  content: string;
  setContent: (content: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  emojiPickerRef: React.RefObject<any>;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmojiSelect: (emojiData: any) => void;
}

const SideBar: React.FC<SideBarProps> = ({
  setImageURL,
  setBackImage,
  content,
  setContent,
  inputRef,
  emojiPickerRef,
  handleImageUpload,
  handleEmojiSelect,
}) => {
  const {
    showEmojie,
    setShowEmojie,
    currentFont,
    currentBack,
    setCurrentFont,
    setCurrentBack,
  } = useNoteStore();

  const { t } = useTranslation();

  return (
    <div className="side-bar-menu">
      {/* ✅ Font Color Picker */}
      <ColorWrapper
        title={t("changeFontColor", "Change font color")}
        color={currentFont}
      >
        <input
          type="color"
          value={currentFont}
          onChange={(e) => setCurrentFont(e.target.value)}
        />
      </ColorWrapper>

      {/* ✅ Background Color Picker */}
      <ColorWrapper
        title={t("changeBackgroundColor", "Change background color")}
        color={currentBack}
        border
      >
        <input
          type="color"
          value={currentBack}
          onChange={(e) => {
            setCurrentBack(e.target.value);
            setImageURL(null);
            setBackImage(null);
          }}
        />
      </ColorWrapper>

      {/* Emoji Picker Toggle */}
      <div
        title={t("pickEmoji", "Pick an emoji!")}
        className="emojie-button-container"
        onClick={() => setShowEmojie(!showEmojie)}
      >
        <MdEmojiEmotions size="1.5rem" />
      </div>

      {/* Image Upload */}
      <div
        title={t("setImageBackground", "Set an image as background")}
        className="img-back-container"
      >
        <label htmlFor="image-back" style={{ cursor: "pointer" }}>
          <FaImage size="1.5rem" />
        </label>
        <input
          id="image-back"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
      </div>

      {/* Copy to Clipboard */}
      <div
        title={t("copyToClipboard", "Copy to clipboard")}
        className="copy-container"
        onClick={async () => {
          const inputElement = inputRef.current;
          if (inputElement) {
            const start = inputElement.selectionStart;
            const end = inputElement.selectionEnd;
            const selectedText = inputElement.value.substring(start, end);
            const textToCopy = selectedText ? selectedText : content;
            await writeText(textToCopy);
          }
        }}
      >
        <MdContentCopy size="1.5rem" />
      </div>

      {/* Paste from Clipboard */}
      <div
        title={t("pasteFromClipboard", "Paste from clipboard")}
        className="paste-container"
        onClick={async () => {
          setContent(content + "\n" + (await readText()));
        }}
      >
        <MdContentPaste size="1.5rem" />
      </div>

      {/* Emoji Picker */}
      {showEmojie && (
        <div className="emoji-picker-container" ref={emojiPickerRef}>
          <EmojiPicker onEmojiClick={handleEmojiSelect} />
        </div>
      )}
    </div>
  );
};

export default SideBar;
