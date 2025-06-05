import { useTranslation } from "react-i18next";
import useStore from "../services/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const MainPage = () => {
  const { lastPage, userAction, user } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user?.id) {
      navigate("/profile");
    } else if (userAction === "neutral") {
      navigate("/home");
    } else {
      navigate(lastPage);
    }
  }, []);
  return <h1>{t("Loading")}...</h1>;
};

export default MainPage;
