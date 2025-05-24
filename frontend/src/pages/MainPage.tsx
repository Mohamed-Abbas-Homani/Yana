import Page from "../components/UI/Page";
import useStore from "../services/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const MainPage = () => {
  const { lastPage, userAction } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (userAction === "neutral") navigate("/home");
    else navigate(lastPage);
  }, []);
  return (
    <Page>
      <p>empty</p>
    </Page>
  );
};

export default MainPage;
