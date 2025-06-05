import { FaTag, FaSmile, FaClock } from "react-icons/fa";
import "../HomePage/HomePage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { summarizeText } from "../../utils/functions";
import { useTranslation } from "react-i18next";
import "./Note.css";

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
    <div
      className="note-display fade-in"
      onClick={() => !isLocked && navigate(`/note/${id}`)}
    >
      <div
        className="note"
        style={{
          color: fcolor,
          backgroundColor: !bpicture ? bcolor : "none",
          backgroundImage: imageURL
            ? `url(${imageURL})`
            : `linear-gradient(135deg, ${fcolor}, ${bcolor})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: isImageLoading || isLocked ? "blur(20px)" : "none",
          transition: "filter 0.5s ease-in-out",
          pointerEvents: isLocked ? "none" : "auto",
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
        {summarizeText(content)}
      </div>

      {isLocked && (
        <div className="password-overlay">
          <input
            type="text"
            className="note-pass"
            placeholder={t("enterPassword", "Enter password to unlock...")}
            value={inputPassword}
            onChange={handlePasswordChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid var(--color)",
              outline: "none",
              background: "transparent",
              color: "var(--color)",
            }}
          />
        </div>
      )}

      {title && <div className="note-title">{title}</div>}
      {tag && (
        <div className="note-tag">
          <small>{tag}</small> <FaTag />
        </div>
      )}
      {mood && (
        <div className="note-mood">
          <small>{mood}</small> <FaSmile />
        </div>
      )}
      <div className="note-date">
        <FaClock />{" "}
        <small style={{ opacity: 0.7 }}>{formatDate(createdAt)}</small>
      </div>
    </div>
  );
};

export default Note;
