import Page from "../components/UI/Page";
import "../components/HomePage/HomePage.css";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import Flag from "../components/HomePage/Flag";
import Note from "../components/HomePage/Note";
import useFetchNotes from "../hooks/useFetchNotes";
import { useState } from "react";
import { useNotesDisplayStore } from "../services/note";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();
  const { notes, loading, setPage, error, setKeyword } = useFetchNotes();
  const { keyword, page, total } = useNotesDisplayStore();
  const [inputKeyword, setInputKeyword] = useState(keyword);
  const navigate = useNavigate();

  const handleSearch = () => {
    setKeyword(inputKeyword);
    setPage(1);
  };

  const handleNextPage = () => {
    if (page < Math.ceil(total / 6)) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const totalPages = Math.ceil(total / 6);

  return (
    <Page>
      <div className="home-container">
        <div className="search-container">
          <div className="flags-container">
            <Flag label={t("Tag")} handleSearch={handleSearch} />
            <Flag label={t("Mood")} handleSearch={handleSearch} />
            <Flag label={t("Content")} handleSearch={handleSearch} />
            <Flag label={t("Title")} handleSearch={handleSearch} />
          </div>
          <div className="search-box">
            {totalPages > 1 && (
              <div className="pagination">
                {page > 1 && (
                  <FaArrowLeft
                    onClick={handlePrevPage}
                    className="pagination-arrow"
                  />
                )}
                <span>
                  {t("page")} {page} {t("of")} {totalPages}
                </span>
                {page < totalPages && (
                  <FaArrowRight
                    onClick={handleNextPage}
                    className="pagination-arrow"
                  />
                )}
              </div>
            )}
            <div className="search-btn" onClick={handleSearch}>
              <FaSearch />
            </div>
            <input
              type="text"
              className="search-text"
              placeholder={t("searchPlaceholder", "Search for anything...")}
              onChange={(e) => setInputKeyword(e.target.value)}
              value={inputKeyword}
            />
          </div>
        </div>

        <div className="notes-container">
          {loading ? (
            <p>{t("loadingNotes", "Loading notes...")}</p>
          ) : error ? (
            <p>
              {t("errorFetchingNotes", "Error fetching notes")}: {error}
            </p>
          ) : notes.length > 0 ? (
            notes.map((note) => (
              <Note
                key={note.id}
                id={note.id}
                password={note.password}
                fcolor={note.fcolor}
                bcolor={note.bcolor}
                bpicture={note.bpicture}
                content={note.content}
                title={note.title}
                tag={note.tag}
                mood={note.mood}
                createdAt={note.createdAt}
              />
            ))
          ) : (
            <div className="add-one-btn" onClick={() => navigate("/note")}>
              {t("noNotesFound", "No notes found")}{" "}
              <p>{t("addOne", "Add one!")}</p>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
};

export default HomePage;
