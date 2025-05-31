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
import useNoteStore, { useFileNoteStore } from "../../../services/note.ts";
import useStore from "../../../services/store.ts";
import useNoteHandler from "../../../hooks/useNoteHandler.ts";
import { useNavigate } from "react-router-dom";
import useDeleteNote from "../../../hooks/useDeleteNote.tsx";
import { useTranslation } from "react-i18next";
import { FaEye, FaPen, FaSave, FaTimes, FaTrash } from "react-icons/fa";
const TopBar = ({ inputRef, content, setContent }: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loading, handleNoteSubmission } = useNoteHandler();
  const { setUserAction } = useStore();
  const { auto, setAuto, mode, toggleMode, reset, id } = useNoteStore();
  const { reset: resetFiles } = useFileNoteStore();
  const [isBulletListActive, setIsBulletListActive] = useState(false);
  const [isNumberedListActive, setIsNumberedListActive] = useState(false);
  const [showFS, setShowFS] = useState<boolean>(false);
  const { loading: deleting, handleDeleteNote } = useDeleteNote();

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
          start + text.length,
        );
      }, 0);
    }
  };

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

  const handleFontSize = (fs: string) => {
    insertAtCursor("\n" + fs + " ");
    setShowFS(false);
  };

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

  return (
    <div className="top-bar">
      <div className="top-bar-menu">
        <div className="sub s1">
          <GoBold size="1.4rem" onClick={handleBold} title={t("bold")} />
          <GoItalic size="1.4rem" onClick={handleItalic} title={t("italic")} />
          <FiUnderline
            size="1.4rem"
            onClick={handleUnderline}
            title={t("underline")}
          />
          <GoStrikethrough
            size="1.4rem"
            onClick={handleStrikethrough}
            title={t("strikethrough")}
          />
          <MdFormatListBulleted
            size="1.4rem"
            onClick={handleBulletList}
            title={t("bulletedList")}
          />
          <MdFormatListNumbered
            size="1.4rem"
            onClick={handleNumberedList}
            title={t("numberedList")}
          />
          <PiHighlighter
            size="1.4rem"
            onClick={handleHighlight}
            title={t("highlight")}
          />
          <RiFontSize
            title={t("heading")}
            size="1.4rem"
            onClick={() => setShowFS(!showFS)}
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

          <TbQuote size="1.4rem" onClick={handleQuote} title={t("quote")} />
          <MdLink size="1.4rem" onClick={handleLink} title={t("link")} />
          <FaCode size="1.4rem" onClick={handleCode} title={t("code")} />
        </div>
        <div className="sub s2">
          <button
            title={t("toggleMode")}
            className="mode-button"
            onClick={() => {
              toggleMode();
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
            {mode === "read" ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                {t("readMode")} <FaEye />
              </span>
            ) : (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                {t("writeMode")} <FaPen />
              </span>
            )}
          </button>
          <button
            title={t("toggleAutoMode")}
            className="auto-button"
            onClick={() => setAuto(!auto)}
          >
            <MdAutoAwesome fontSize={"1.3rem"} />
          </button>
          {auto && <sup>{t("auto")}</sup>}
        </div>
      </div>

      <div className="create-note-submit-buttons">
        {id && (
          <button
            className="control-btn"
            disabled={deleting}
            onClick={async () => {
              await handleDeleteNote(id);
              reset();
              resetFiles();
              navigate("/home");
              setUserAction("neutral");
            }}
            title={t("delete")}
          >
            {deleting ? (
              <span title={t("deleting...")}>{t("deleting...")}</span>
            ) : (
              <FaTrash fontSize={"1.4rem"} />
            )}
          </button>
        )}
        <button
          className="control-btn"
          onClick={() => {
            setUserAction("neutral");
            reset();
            resetFiles();
            navigate("/home");
          }}
          disabled={loading}
          title={t("cancel")}
        >
          <FaTimes fontSize={"1.4rem"} />
        </button>
        <button
          className="control-btn"
          disabled={loading}
          onClick={async () => {
            await handleNoteSubmission();
            reset();
            resetFiles();
            navigate("/home");
            setUserAction("neutral");
          }}
          title={t("Save")}
        >
          {loading ? (
            <span title={t("Saving...")}>{t("Saving...")}</span>
          ) : (
            <FaSave fontSize={"1.4rem"} />
          )}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
