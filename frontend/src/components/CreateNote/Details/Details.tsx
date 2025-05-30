import useNoteStore from "../../../services/note.ts";
import { useTranslation } from "react-i18next";
import "./Details.css"
const Details = () => {
  const { t } = useTranslation();
  const { title, setTitle, password, setPassword, tag, setTag, mood, setMood } =
    useNoteStore();

  return (
    <div className="create-note-container-detail">
      <h2>{t("detailsHeader")}</h2>

      <div className="detail-input">
        <input
          type="text"
          required
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label={t("titleLabel")}
        />
        <label htmlFor="title">{t("titleLabel")}</label>
      </div>

      <div className="detail-input">
        <input
          type="password"
          required
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label={t("passwordLabel")}
        />
        <label htmlFor="password">{t("passwordLabel")}</label>
      </div>

      <div className="detail-input">
        <input
          type="text"
          required
          id="tag"
          name="tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          aria-label={t("tagLabel")}
        />
        <label htmlFor="tag">{t("tagLabel")}</label>
      </div>

      <div className="detail-input">
        <input
          type="text"
          required
          id="mood"
          name="mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          aria-label={t("moodLabel")}
        />
        <label htmlFor="mood">{t("moodLabel")}</label>
      </div>
    </div>
  );
};

export default Details;
