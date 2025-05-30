import { MdEmojiEmotions, MdContentCopy, MdContentPaste } from "react-icons/md";
import { FaImage } from "react-icons/fa6";
import EmojiPicker from "emoji-picker-react";
import { writeText, readText } from "@tauri-apps/plugin-clipboard-manager";
import { useTranslation } from "react-i18next";
import "./SideBar.css";
import useNoteStore from "../../../services/note.ts";

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
      <input
        title={t("changeFontColor", "Change font color")}
        type="color"
        value={currentFont}
        onChange={(e) => setCurrentFont(e.target.value)}
        className="color-input"
        style={{ backgroundColor: currentFont }}
      />
      <input
        title={t("changeBackgroundColor", "Change background color")}
        type="color"
        value={currentBack}
        onChange={(e) => {
          setCurrentBack(e.target.value);
          setImageURL(null);
          setBackImage(null);
        }}
        className="color-input color-input-back"
        style={{ backgroundColor: currentBack }}
      />
      <div
        title={t("pickEmoji", "Pick an emoji!")}
        className="emojie-button-container"
        onClick={() => setShowEmojie(!showEmojie)}
      >
        <MdEmojiEmotions size="1.5rem" />
      </div>
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
      <div
        title={t("pasteFromClipboard", "Paste from clipboard")}
        className="paste-container"
        onClick={async () => {
          setContent(content + "\n" + (await readText()));
        }}
      >
        <MdContentPaste size="1.5rem" />
      </div>
      {showEmojie && (
        <div className="emoji-picker-container" ref={emojiPickerRef}>
          <EmojiPicker onEmojiClick={handleEmojiSelect} />
        </div>
      )}
    </div>
  );
};

export default SideBar;
