import { GoBold, GoItalic, GoStrikethrough } from "react-icons/go";
import { FiUnderline } from "react-icons/fi";
import {
  MdAutoAwesome,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdLink,
} from "react-icons/md";
import { PiHighlighter } from "react-icons/pi";
import { RiFontSize } from "react-icons/ri";
import { TbQuote } from "react-icons/tb";
import { FaCode } from "react-icons/fa6";
import "./TopBar.css";
import { useState, useEffect } from "react";

const TopBar = ({
  auto,
  setAuto,
  inputRef,
  mode,
  setMode,
  content,
  setContent,
}: any) => {
  const [isBulletListActive, setIsBulletListActive] = useState(false);
  const [isNumberedListActive, setIsNumberedListActive] = useState(false);
  const [showFS, setShowFS] = useState<boolean>(false);
  const [logoImg, setLogoImg] = useState<any>(null);
  // Function to insert text at the cursor position in the textarea
  const insertAtCursor = (text: string) => {
    const inputElement = inputRef.current;
    if (inputElement && inputElement instanceof HTMLTextAreaElement) {
      const start = inputElement.selectionStart;
      const end = inputElement.selectionEnd;
      const newText = content?.slice(0, start) + text + content?.slice(end);
      setContent(newText);
      setTimeout(() => {
        inputElement.focus();
        inputElement.setSelectionRange(
          start + text.length,
          start + text.length
        );
      }, 0);
    }
  };

  // Handlers for different formatting options
  const handleBold = () => insertAtCursor("****");
  const handleItalic = () => insertAtCursor("**");
  const handleUnderline = () => insertAtCursor("<u></u>");
  const handleStrikethrough = () => insertAtCursor("~~");
  const handleBulletList = () => {
    setIsBulletListActive(true);
    insertAtCursor("- ");
  };
  const handleNumberedList = () => {
    setIsNumberedListActive(true);
    insertAtCursor("1. ");
  };
  const handleQuote = () => insertAtCursor("“”");
  const handleCode = () => insertAtCursor("```language\n\n```");
  const handleLink = () => insertAtCursor("[]()");
  const handleHighlight = () => insertAtCursor("<mark></mark>");

  // Font size selection dropdown
  const handleFontSize = (fs: string) => {
    insertAtCursor("\n" + fs + " ");
    setShowFS(false);
  };

  // Handle "Enter" key for list items
  const handleEnter = (event: KeyboardEvent) => {
    const inputElement = inputRef.current;
    if (inputElement && inputElement instanceof HTMLTextAreaElement) {
      const start = inputElement.selectionStart;
      const end = inputElement.selectionEnd;

      const lines = content?.split("\n") || [];
      const lastLine = lines[lines.length - 1];

      const isBulletLine = lastLine.trim() === "-";
      const isNumberedLine = /^\d+\.$/.test(lastLine.trim());

      if (isBulletListActive && isBulletLine) {
        const newText = content?.slice(0, content.lastIndexOf("\n")) || "";
        setContent(newText + "\n");
        setIsBulletListActive(false);
        return;
      }

      if (isNumberedListActive && isNumberedLine) {
        const newText = content?.slice(0, content.lastIndexOf("\n")) || "";
        setContent(newText + "\n");
        setIsNumberedListActive(false);
        return;
      }

      if (isBulletListActive) {
        const newText = content?.slice(0, start) + "\n- " + content?.slice(end);
        setContent(newText);
        event.preventDefault();
      }

      if (isNumberedListActive) {
        const numberMatch = lastLine.match(/^(\d+)\./);
        let nextNumber = numberMatch ? parseInt(numberMatch[1]) + 1 : 1;
        const newText =
          content?.slice(0, start) + `\n${nextNumber}. ` + content?.slice(end);
        setContent(newText);
        event.preventDefault();
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleEnter(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [content, isBulletListActive, isNumberedListActive]);

  // Handle the image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoImg(e.target?.result); // Set the logo image using FileReader
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="top-bar">
      <div
        className="logo"
        style={{
          backgroundImage: logoImg ? `url(${logoImg})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
        <label className="logo-filter" htmlFor="image-upload"></label>
      </div>
      <div className="top-bar-menu">
        <div className="sub s1">
          <GoBold size={"1.5em"} onClick={handleBold} title="Bold" />
          <GoItalic size={"1.5em"} onClick={handleItalic} title="Italic" />
          <FiUnderline
            size={"1.5em"}
            onClick={handleUnderline}
            title="Underline"
          />
          <GoStrikethrough
            size={"1.5em"}
            onClick={handleStrikethrough}
            title="Strike Through"
          />
          <MdFormatListBulleted
            size={"1.5em"}
            onClick={handleBulletList}
            title="Bulleted List"
          />
          <MdFormatListNumbered
            size={"1.5em"}
            onClick={handleNumberedList}
            title="Numbered List"
          />
          <PiHighlighter
            size={"1.5em"}
            onClick={handleHighlight}
            title="Marked"
          />

          {/* Font size dropdown */}
          <RiFontSize
            title="Heading"
            size={"1.5em"}
            onClick={() => {
              setShowFS(!showFS);
            }}
          />

          {showFS && (
            <div className="font-size-buttons fade-in">
              <button onClick={() => handleFontSize("#")}>1</button>
              <button onClick={() => handleFontSize("##")}>2</button>
              <button onClick={() => handleFontSize("###")}>3</button>
              <button onClick={() => handleFontSize("####")}>4</button>
              <button onClick={() => handleFontSize("#####")}>5</button>
              <button onClick={() => handleFontSize("######")}>6</button>
            </div>
          )}

          <TbQuote size={"1.5em"} onClick={handleQuote} title="Quote" />
          <MdLink size={"1.5em"} onClick={handleLink} title="Link" />
          <FaCode size={"1.5em"} onClick={handleCode} title="Code" />
        </div>
        <div className="sub s2">
          <button
            title="switch mode"
            className="mode-button"
            onClick={() => {
              setMode((prev: any) => (prev === "write" ? "read" : "write"));
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
            {mode === "read" ? "read mode" : "write mode"}
          </button>
          <button
            title="auto mode switching"
            className="auto-button"
            onClick={() => {
              setAuto(!auto);
            }}
          >
            <MdAutoAwesome />
          </button>
          {auto && <sup>auto</sup>}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
