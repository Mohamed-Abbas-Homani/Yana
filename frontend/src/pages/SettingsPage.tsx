import { useEffect } from "react";
import Page from "../components/UI/Page";
import useStore from "../services/store";
import useConfig from "../services/config";
import "../components/SettingsPage/settings.css";
import { useTranslation } from "react-i18next";

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
  } = useConfig();

  useEffect(() => {
    setLastPage("/settings");
  }, []);

  return (
    <Page>
      <div className="set-container">
        <div className="set-color">
          <label htmlFor="gbg">{t("globalBackgroundColor")}</label>
          <input
            type="color"
            id="gbg"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </div>

        <div className="set-color">
          <label htmlFor="gfg">{t("globalForegroundColor")}</label>
          <input
            type="color"
            id="gfg"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
          />
        </div>

        <div className="set-color">
          <label htmlFor="pbg">{t("profileBackgroundColor")}</label>
          <input
            type="color"
            id="pbg"
            value={profileBackgroundColor}
            onChange={(e) => setProfileBackgroundColor(e.target.value)}
          />
        </div>

        <div className="set-color">
          <label htmlFor="pfg">{t("profileForegroundColor")}</label>
          <input
            type="color"
            id="pfg"
            value={profileFontColor}
            onChange={(e) => setProfileFontColor(e.target.value)}
          />
        </div>

        <div className="set-color">
          <label htmlFor="mbg">{t("menuItemBackgroundColor")}</label>
          <input
            type="color"
            id="mbg"
            value={menuItemBackground}
            onChange={(e) => setMenuItemBackground(e.target.value)}
          />
        </div>

        <div className="set-color">
          <label htmlFor="mtg">{t("menuToggleBackgroundColor")}</label>
          <input
            type="color"
            id="mtg"
            value={menuToggleBackground}
            onChange={(e) => setMenuToggleBackground(e.target.value)}
          />
        </div>
      </div>
    </Page>
  );
};

export default SettingsPage;
