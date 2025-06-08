import { FaTag, FaSmile, FaClock, FaLock } from "react-icons/fa";
import "../HomePage/HomePage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { summarizeText } from "../../utils/functions";
import { useTranslation } from "react-i18next";
import "./Note.css";
import ReactMarkdown from "react-markdown";

// Function to format timestamp
const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-GB", options);
};

const Note = ({
  content,
  title,
  tag,
  mood,
  password,
  fcolor,
  bcolor,
  bpicture,
  id,
  createdAt,
}: any) => {
  const [imageURL, setImageURL] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(!!password);
  const [inputPassword, setInputPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (bpicture) {
      const imageUrl = URL.createObjectURL(bpicture);
      setIsImageLoading(true);
      setImageURL(imageUrl);
    }
  }, [bpicture]);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredPassword = e.target.value;
    setInputPassword(enteredPassword);
    if (enteredPassword === password) {
      setIsLocked(false);
    }
  };

  return (
    <div className="note-display fade-in">
      <div
        className="note-card"
        onClick={() => !isLocked && navigate(`/note/${id}`)}
        style={{
          color: fcolor,
          backgroundColor: !bpicture ? bcolor : "transparent",
          backgroundImage: imageURL
            ? `url(${imageURL})`
            : `linear-gradient(135deg, ${fcolor}20, ${bcolor})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: isImageLoading ? "blur(10px)" : "none",
          transition: "all 0.3s ease-in-out",
          cursor: isLocked ? "default" : "pointer",
        }}
      >
        {imageURL && (
          <img
            src={imageURL}
            alt="Note Background"
            style={{ display: "none" }}
            onLoad={handleImageLoad}
          />
        )}

        {/* Note Header */}
        <div className="note-header">
          {title && <h3 className="note-title">{title}</h3>}
          {isLocked && <FaLock className="lock-icon" />}
        </div>

        {/* Note Content - only show if not locked */}
        {!isLocked && (
          <div className="note-content">
            <ReactMarkdown className="note-text">
              {summarizeText(content)}
            </ReactMarkdown>{" "}
          </div>
        )}

        {/* Password Input Overlay */}
        {isLocked && (
          <div className="password-section">
            <div className="password-prompt">
              <FaLock className="password-lock-icon" />
              <p className="password-text">This note is protected</p>
            </div>
            <input
              type="password"
              className="password-input"
              placeholder={t("enterPassword", "Enter password to unlock...")}
              value={inputPassword}
              onChange={handlePasswordChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Note Footer - only show if not locked */}
        {!isLocked && (
          <div className="note-footer">
            <div className="note-meta-left">
              <div className="note-date">
                <FaClock className="meta-icon" />
                <span className="meta-text">{formatDate(createdAt)}</span>
              </div>
            </div>
            <div className="note-meta-right">
              {tag && (
                <div className="note-tag">
                  <FaTag className="meta-icon" />
                  <span className="meta-text">{tag}</span>
                </div>
              )}
              {mood && (
                <div className="note-mood">
                  <FaSmile className="meta-icon" />
                  <span className="meta-text">{mood}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Note;
