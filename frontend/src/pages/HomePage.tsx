import Page from "../components/UI/Page";
import useStore from "../services/store";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { appDataDir } from "@tauri-apps/api/path";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const { lastPage, userAction } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (userAction === "neutral") navigate("/");
    else navigate(lastPage);
  }, []);
  const { addNotification } = useStore();
  const testi = async () => {
    const appDataDirPath = await appDataDir();
    console.log(appDataDirPath);
  };
  useEffect(() => {
    testi();
    addNotification("Welcome Back Mash!", "info");
  }, []);
  return (
    <Page>
      <ReactMarkdown>{`.`}</ReactMarkdown>
    </Page>
  );
};

export default HomePage;
