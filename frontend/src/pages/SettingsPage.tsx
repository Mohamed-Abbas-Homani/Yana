import { useEffect } from "react";
import Page from "../components/UI/Page";
import useStore from "../services/store";
import useConfig from "../services/config"; // Import your config store
import "../components/SettingsPage/settings.css";

const SettingsPage = () => {
  const { setLastPage } = useStore();
  const {
    fontColor,
    setFontColor,
    backgroundColor,
    setBackgroundColor,
    profileFontColor,
    setProfileFontColor,
    profileBackgroundColor,
    setProfileBackgroundColor
  } = useConfig();

  useEffect(() => {
    setLastPage("/settings");
  }, []);

  return (
    <Page>
      <div className="set-container">
        <div className="set-color">
          <label htmlFor="gbg">Global Background Color</label>
          <input
            type="color"
            id="gbg"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </div>

        <div className="set-color">
          <label htmlFor="gfg">Global Foreground Color</label>
          <input
            type="color"
            id="gfg"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
          />
        </div>

        <div className="set-color">
          <label htmlFor="pbg">Profile Background Color</label>
          <input
            type="color"
            id="pbg"
            value={profileBackgroundColor}
            onChange={(e) => setProfileBackgroundColor(e.target.value)}
          />
        </div>

        <div className="set-color">
          <label htmlFor="pfg">Profile Foreground Color</label>
          <input
            type="color"
            id="pfg"
            value={profileFontColor}
            onChange={(e) => setProfileFontColor(e.target.value)}
          />
        </div>
      </div>
    </Page>
  );
};

export default SettingsPage;
