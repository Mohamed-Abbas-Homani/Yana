import React, { ReactNode } from "react";
import Notification from "../Notification/Notification";
import CircularMenu from "../CircularMenu/CircularMenu";
import "../../animations/base.css";
import useStore from "../../services/store";

interface PageProps {
  children: ReactNode;
}

const Page: React.FC<PageProps> = ({ children }) => {
  const { cmenuStatus } = useStore();
  const { userAction } = useStore();
  return (
    <main className={`container fade-in`}>
      <Notification />
      <div
        className={`null-div ${cmenuStatus === "active" ? "menu-blur" : ""}`}
      >
        {children}
      </div>
      {userAction === "neutral" && <CircularMenu />}{" "}
    </main>
  );
};

export default Page;
