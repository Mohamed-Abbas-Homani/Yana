import { useEffect, useState } from "react";
import Page from "../components/UI/Page";
import useStore from "../services/store";
import useConfig from "../services/config";
import "../components/SettingsPage/settings.css";
import { useTranslation } from "react-i18next";

const fontOptions = [
  {
    value: "var(--font-nova)",
    label: "Nova",
    style: { fontFamily: "var(--font-nova)" },
  },
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
    value: "var(--font-tangerine)",
    label: "Tangerine",
    style: { fontFamily: "var(--font-tangerine)" },
  },
];

const SettingsPage = () => {
  const { t } = useTranslation();
  const { setLastPage } = useStore();
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

  useEffect(() => {
    setLastPage("/settings");
  }, []);

  return (
    <Page>
      <div className="settings-grid">
        {/* Left Column: Color Pickers */}
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

        {/* Right Column: Font Selector */}
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
      </div>
    </Page>
  );
};

export default SettingsPage;
