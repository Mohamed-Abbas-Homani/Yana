import { FaTag, FaSmile, FaClock } from "react-icons/fa";
import "../HomePage/HomePage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { summarizeText } from "../../utils/functions";
// Function to format timestamp
const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);

  // Formatting options for date and time
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // This ensures we get am/pm formatting
  };

  return date.toLocaleString("en-GB", options); // 'en-GB' will format the date as DD/MM/YYYY
};

const Note = ({ content, title, tag, mood, password, fcolor, bcolor, bpicture, id, createdAt }: any) => {
  const [imageURL, setImageURL] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false); // Track image loading state
  const [isLocked, setIsLocked] = useState(!!password); // Track if the note is locked
  const [inputPassword, setInputPassword] = useState(""); // Track the password input
  const navigate = useNavigate();

  useEffect(() => {
    if (bpicture) {
      const imageUrl = URL.createObjectURL(bpicture);
      setIsImageLoading(true); // Image is loading
      setImageURL(imageUrl);
    }
  }, [bpicture]);

  const handleImageLoad = () => {
    setIsImageLoading(false); // Image has finished loading
  };

  // Handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredPassword = e.target.value;
    setInputPassword(enteredPassword);

    // If the entered password matches, unlock the note
    if (enteredPassword === password) {
      setIsLocked(false);
    }
  };

  return (
    <div className="note-display fade-in" onClick={() => !isLocked && navigate(`/note/${id}`)}>
      <div
        className="note"
        style={{
          color: fcolor,
          backgroundColor: !bpicture ? bcolor : "none", // Use color if no picture
          backgroundImage: imageURL ? `url(${imageURL})` : `linear-gradient(135deg, ${fcolor}, ${bcolor})`, // Apply gradient while loading
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: isImageLoading || isLocked ? "blur(20px)" : "none", // Apply blur while loading or if locked
          transition: "filter 0.5s ease-in-out", // Smooth transition when image is loaded
          pointerEvents: isLocked ? "none" : "auto", // Disable pointer events if locked
        }}
      >
        {imageURL && (
          <img
            src={imageURL}
            alt="Note Background"
            style={{ display: "none" }} // Hide the image element
            onLoad={handleImageLoad} // Trigger once the image is loaded
          />
        )}
        {summarizeText(content)}
      </div>

      {/* Password input field (only shown if the note is locked) */}
      {isLocked && (
        <div className="password-overlay">
          <input
            type="text"
            className="note-pass"
            placeholder="Enter password to unlock..."
            value={inputPassword}
            onChange={handlePasswordChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid var(--color)",
              outline: "none",
              background:"transparent",
              color:"var(--color)"
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
        <FaClock /> <small style={{ opacity: 0.7 }}>{formatDate(createdAt)}</small>
      </div>
    </div>
  );
};

export default Note;