import { MdEmojiEmotions, MdContentCopy, MdContentPaste } from "react-icons/md";
import { FaImage } from "react-icons/fa6";
import EmojiPicker from "emoji-picker-react";
import { writeText, readText } from "@tauri-apps/plugin-clipboard-manager";
import "./SideBar.css"

interface SideBarProps {
  currentFont: string;
  setCurrentFont: (color: string) => void;
  currentBack: string;
  setCurrentBack: (color: string) => void;
  setImageURL: (url: string | null) => void;
  showEmojie: boolean;
  setShowEmojie: (show: boolean) => void;
  content: string;
  setContent: (content: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  emojiPickerRef: React.RefObject<any>;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmojiSelect: (emojiData: any) => void;
}

const SideBar: React.FC<SideBarProps> = ({
  currentFont,
  setCurrentFont,
  currentBack,
  setCurrentBack,
  setImageURL,
  showEmojie,
  setShowEmojie,
  content,
  setContent,
  inputRef,
  emojiPickerRef,
  handleImageUpload,
  handleEmojiSelect,
}) => {
  return (
    <div className="side-bar-menu">
    <input
      title="change font color"
      type="color"
      value={currentFont}
      onChange={(e: any) => {
        setCurrentFont(e.target.value);
      }}
      className="color-input"
      style={{ backgroundColor: currentFont }}
    />
    <input
      title="change background color"
      type="color"
      value={currentBack}
      onChange={(e: any) => {
        setCurrentBack(e.target.value);
        setImageURL(null);
      }}
      className="color-input color-input-back"
      style={{
        backgroundColor: currentBack,
      }}
    />
    <div
      title="pick an emojie!"
      className="emojie-button-container"
      onClick={() => {
        setShowEmojie(!showEmojie);
      }}
    >
      <MdEmojiEmotions size="1.5em" />
    </div>
    <div
      title="set an image as background"
      className="img-back-container"
    >
      <label htmlFor="image-back">
        <FaImage size="1.5em" />
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
      title="copy to clipboard"
      className="copy-container"
      onClick={async () => {
        const inputElement = inputRef.current;
        if (inputElement) {
          const start = inputElement.selectionStart;
          const end = inputElement.selectionEnd;
          const selectedText = inputElement.value.substring(
            start,
            end
          );

          // Copy selected text if available, otherwise copy the entire content
          const textToCopy = selectedText ? selectedText : content;
          await writeText(textToCopy);
        }
      }}
    >
      <MdContentCopy size="1.5em" />
    </div>
    <div
      title="paste from clipboard"
      className="paste-container"
      onClick={async () => {
        setContent(content + "\n" + (await readText()));
      }}
    >
      <MdContentPaste size="1.5em" />
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
