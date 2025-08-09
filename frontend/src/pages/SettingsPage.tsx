import { useEffect, useState } from "react";
import Page from "../components/UI/Page";
import useStore from "../services/store";
import useConfig from "../services/config";
import "../components/SettingsPage/settings.css";
import { useTranslation } from "react-i18next";
import { CONSTANTS } from "../const";
import useDataPersist from "../hooks/useDataPersist";

const fontOptions = [
  {
    value: "var(--font-patrick)",
    label: "Patrick",
    style: { fontFamily: "var(--font-patrick)" },
  },
  {
    value: "var(--font-pixelify)",
    label: "Pixelify",
    style: { fontFamily: "var(--font-pixelify)" },
  },
  {
    value: "var(--font-syne)",
    label: "Syne",
    style: { fontFamily: "var(--font-syne)" },
  },
  {
    value: "var(--font-zain)",
    label: "Zain",
    style: { fontFamily: "var(--font-zain)" },
  },
  {
    value: "var(--font-barriecito)",
    label: "Barriecito",
    style: { fontFamily: "var(--font-barriecito)" },
  }
];


const SettingsPage = () => {
  const { t } = useTranslation();
  const { setLastPage, addNotification } = useStore();
  const { saveData, reloadData } = useDataPersist();
  const {
    fontColor,
    setFontColor,
    backgroundColor,
    setBackgroundColor,
    profileFontColor,
    setProfileFontColor,
    profileBackgroundColor,
    setProfileBackgroundColor,
    menuItemBackground,
    setMenuItemBackground,
    menuToggleBackground,
    setMenuToggleBackground,
    font,
    setFont,
  } = useConfig();

  const [fontMenuOpen, setFontMenuOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  // New loading states
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    setLastPage("/settings");
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await saveData();
      const res = await fetch(`${CONSTANTS.BackURL}/export`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "yana-db.sqlite";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      addNotification(t("Export failed"), "error");
    } finally {
      setIsExporting(false);
      addNotification(t("Exported sucessfuly to downloads"), "success");
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      addNotification("Add a file", "info");
      return;
    }
    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", importFile);
      const res = await fetch(`${CONSTANTS.BackURL}/import`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Import failed");
      setImportFile(null);
      await reloadData();
    } catch (error) {
      addNotification(t("Import failed"), "error");
    } finally {
      setIsImporting(false);
      addNotification(t("Database imported successfully"), "success");
    }
  };
  return (
    <Page>
      <div className="settings-grid">
        {/* Left Column: Colors */}
        <div className="set-container">
          <div className="set-color">
            <label htmlFor="gbg">{t("globalBackgroundColor")}</label>
            <input
              type="color"
              id="gbg"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="color-picker"
            />
          </div>
          <div className="set-color">
            <label htmlFor="gfg">{t("globalForegroundColor")}</label>
            <input
              type="color"
              id="gfg"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className="color-picker"
            />
          </div>
          <div className="set-color">
            <label htmlFor="pbg">{t("profileBackgroundColor")}</label>
            <input
              type="color"
              id="pbg"
              value={profileBackgroundColor}
              onChange={(e) => setProfileBackgroundColor(e.target.value)}
              className="color-picker"
            />
          </div>
          <div className="set-color">
            <label htmlFor="pfg">{t("profileForegroundColor")}</label>
            <input
              type="color"
              id="pfg"
              value={profileFontColor}
              onChange={(e) => setProfileFontColor(e.target.value)}
              className="color-picker"
            />
          </div>
          <div className="set-color">
            <label htmlFor="mbg">{t("menuItemBackgroundColor")}</label>
            <input
              type="color"
              id="mbg"
              value={menuItemBackground}
              onChange={(e) => setMenuItemBackground(e.target.value)}
              className="color-picker"
            />
          </div>
          <div className="set-color">
            <label htmlFor="mtg">{t("menuToggleBackgroundColor")}</label>
            <input
              type="color"
              id="mtg"
              value={menuToggleBackground}
              onChange={(e) => setMenuToggleBackground(e.target.value)}
              className="color-picker"
            />
          </div>
        </div>

        {/* Middle Column: Fonts */}
        <div className="font-column">
          <label>{t("chooseFont")}</label>
          <div
            className="font-display"
            onClick={() => setFontMenuOpen((prev) => !prev)}
            style={{ fontFamily: font, cursor: "pointer" }}
          >
            {fontOptions.find((f) => f.value === font)?.label || t("Select")}
          </div>
          {fontMenuOpen && (
            <div className="font-list">
              {fontOptions.map((option) => (
                <div
                  key={option.value}
                  className="font-item"
                  style={option.style}
                  onClick={() => {
                    setFont(option.value);
                    setFontMenuOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Import/Export */}
        <div className="db-column">
          {t("database") || "Database"}

          <button onClick={handleExport} disabled={isExporting || isImporting}>
            {isExporting
              ? t("exporting") || "Exporting..."
              : t("exportDB") || "Export DB"}
          </button>

          <input
            type="file"
            disabled={isExporting || isImporting}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files.length > 0) {
                setImportFile(e.target.files[0]);
              }
            }}
          />

          <button
            onClick={handleImport}
            disabled={isExporting || isImporting || !importFile}
          >
            {isImporting
              ? t("importing") || "Importing..."
              : t("importDB") || "Import DB"}
          </button>
        </div>
      </div>
    </Page>
  );
};

export default SettingsPage;
