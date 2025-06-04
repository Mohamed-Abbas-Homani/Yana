import React, { ReactNode, useEffect } from "react";
import Notification from "../Notification/Notification";
import CircularMenu from "../CircularMenu/CircularMenu";
import "../../animations/base.css";
import useStore, { useTempStore } from "../../services/store";
import { useNavigate } from "react-router-dom";

interface PageProps {
  children: ReactNode;
}

const Page: React.FC<PageProps> = ({ children }) => {
  const { cmenuStatus, userAction, isPomoOn } = useStore();
  const { justEnter, setJustEnter } = useTempStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (justEnter) {
      setJustEnter(false);
      if (isPomoOn) {
        navigate("/pomodoro");
      }
    }
  }, []);
  return (
    <main className={`container fade-in`}>
      <Notification />
      <div
        className={`null-div ${cmenuStatus === "active" ? "menu-blur" : ""}`}
      >
        {children}
      </div>
      {["neutral", "pomodoro"].includes(userAction) && <CircularMenu />}{" "}
    </main>
  );
};

export default Page;
