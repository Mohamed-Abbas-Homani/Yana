import { useTranslation } from "react-i18next";
import Page from "../components/UI/Page";
import useStore from "../services/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const MainPage = () => {
  const { lastPage, userAction, user } = useStore();
  const {t} = useTranslation()
  const navigate = useNavigate();
  useEffect(() => {
    if (!user?.id) {
      navigate("/profile");
    } else if (userAction === "neutral") navigate("/home");
    else navigate(lastPage);
  }, []);
  return (
    <Page>
      <p>{t('Loading')}...</p>
    </Page>
  );
};

export default MainPage;
