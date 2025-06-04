import React, { useState, useEffect } from "react";
import "./CircularMenu.css";
import { FaChalkboard, FaHome, FaPencilAlt, FaUser } from "react-icons/fa";
import { IoSettings, IoTime } from "react-icons/io5";
import { debounce } from "../../utils/functions";
import { useNavigate } from "react-router-dom";
import useStore from "../../services/store";
import { useTranslation } from "react-i18next";

const CircularMenu: React.FC = () => {
  const { setCMenuStatus } = useStore();
  const [status, setStatus] = useState("hide");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const debouncedHide = debounce(() => {
    setStatus("hide");
  }, 3400);

  useEffect(() => {
    setCMenuStatus(status);
  }, [status]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const bottomThreshold = window.innerHeight - 144;
      const leftThreshold = 144;
      if (e.clientY > bottomThreshold && e.clientX < leftThreshold) {
        setStatus((prev) => (prev === "active" ? "active" : "hold"));
        debouncedHide();
      } else {
        setStatus((prev) => (prev === "active" ? "active" : "hide"));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const activate = () => {
    setStatus((prev) => (prev === "active" ? "hold" : "active"));
  };

  const onItemClick = (route: string) => {
    setStatus("hide");
    navigate(route);
  };

  return (
    <div className={`menu ${status}`}>
      <div className="toggle" onClick={activate} title="Click!"></div>
      <li
        style={{ "--i": 1 } as React.CSSProperties}
        title={t("circularMenu.addNote")}
        onClick={() => onItemClick("/note")}
      >
        <div>
          <FaPencilAlt />
        </div>
      </li>
      <li
        style={{ "--i": 2 } as React.CSSProperties}
        title={t("circularMenu.search")}
        onClick={() => onItemClick("/")}
      >
        <div>
          <FaHome />
        </div>
      </li>
      <li
        style={{ "--i": 3 } as React.CSSProperties}
        title={t("circularMenu.whiteboard")}
        onClick={() => onItemClick("/whiteboard")}
      >
        <div>
          <FaChalkboard />
        </div>
      </li>
      {/* <li
        style={{ "--i": 4 } as React.CSSProperties}
        title={t("circularMenu.settings")}
        onClick={() => onItemClick("/settings")}
      >
        <div>
          <IoSettings />
        </div>
      </li> */}
      <li
        style={{ "--i": 4 } as React.CSSProperties}
        title={t("circularMenu.pomodoro")}
        onClick={() => onItemClick("/pomodoro")}
      >
        <div>
          <IoTime />
        </div>
      </li>
      <li
        style={{ "--i": 5 } as React.CSSProperties}
        title={t("circularMenu.profile")}
        onClick={() => onItemClick("/profile")}
      >
        <div>
          <FaUser />
        </div>
      </li>
    </div>
  );
};

export default CircularMenu;
