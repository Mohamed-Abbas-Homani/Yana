import Page from "../components/UI/Page";
import "../components/HomePage/HomePage.css";
import { FaArrowLeft, FaArrowRight, FaSearch, FaFilter, FaClock, FaHashtag } from "react-icons/fa";
import Note from "../components/HomePage/Note";
import useFetchNotes from "../hooks/useFetchNotes";
import { useState } from "react";
import { useNotesDisplayStore } from "../services/note";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();
  const { notes, loading, setPage, error, setKeyword } = useFetchNotes();
  const { keyword, page, total, filters, toggleFilter } = useNotesDisplayStore();
  const [inputKeyword, setInputKeyword] = useState(keyword);
  const navigate = useNavigate();

  const handleSearch = () => {
    setKeyword(inputKeyword);
    setPage(1);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleFilterClick = (filterKey: string) => {
    toggleFilter(filterKey);
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
  const startNote = (page - 1) * 6 + 1;
  const endNote = Math.min(page * 6, total);

  const availableFilters = [
    { key: "title", label: t("Title"), icon: FaHashtag },
    { key: "content", label: t("Content"), icon: FaFilter },
    { key: "tag", label: t("Tag"), icon: FaHashtag },
    { key: "mood", label: t("Mood"), icon: FaClock },
  ];

  return (
    <Page>
      <div className="home-container">
        <div className="search-container">
          {/* Search Header */}
          <div className="search-header">
            <div className="search-box">
              <button className="search-btn" onClick={handleSearch}>
                <FaSearch />
              </button>
              <input
                type="text"
                className="search-text"
                placeholder={t("searchPlaceholder", "Search for anything...")}
                onChange={(e) => setInputKeyword(e.target.value)}
                onKeyDown={handleKeyPress}
                value={inputKeyword}
              />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination">
                  <button
                    className="pagination-arrow"
                    onClick={handlePrevPage}
                    disabled={page <= 1}
                  >
                    <FaArrowLeft />
                  </button>
                  <span>
                    {t("page")} {page} {t("of")} {totalPages}
                  </span>
                  <button
                    className="pagination-arrow"
                    onClick={handleNextPage}
                    disabled={page >= totalPages}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="filters-section">
            <span className="filters-label">{t("filterBy", "Filter by")}:</span>
            <div className="filters-container">
              {availableFilters.map((filter) => {
                const IconComponent = filter.icon;
                const isActive = filters.includes(filter.key);
                return (
                  <div
                    key={filter.key}
                    className={`filter-chip ${isActive ? "active" : ""}`}
                    onClick={() => handleFilterClick(filter.key)}
                  >
                    <IconComponent style={{ marginRight: "0.5rem", fontSize: "0.8rem" }} />
                    {filter.label}
                  </div>
                );
              })}
            </div>
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

        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-item">
            <FaFilter />
            <span>
              {t("filter", "Filter")}:{" "}
              {filters.length === 0
                ? t("all", "All")
                : filters
                    .map((key) => {
                      const filter = availableFilters.find((f) => f.key === key);
                      return filter ? filter.label : key;
                    })
                    .join(", ")}
            </span>
          </div>
          <div className="status-separator"></div>
          <div className="status-item">
            <FaHashtag />
            <span>
              {t("total")}: {total}
            </span>
          </div>
          <div className="status-separator"></div>
          <div className="status-item">
            <FaClock />
            <span>
              {t("showing", "Showing")}: {total > 0 ? `${startNote}-${endNote}` : "0"}
            </span>
          </div>
          {keyword && (
            <>
              <div className="status-separator"></div>
              <div className="status-item">
                <FaSearch />
                <span>
                  {t("searchTerm", "Search")}: "{keyword}"
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </Page>
  );
};

export default HomePage;
