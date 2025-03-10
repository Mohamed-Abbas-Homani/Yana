import React, { useState, useEffect } from "react";
import "./CircularMenu.css"; // Ensure this file is properly set up for styling
import { GoHome, GoSearch } from "react-icons/go";
import { FaHome, FaPencilAlt, FaUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { debounce } from "../../utils/functions";
import { useNavigate } from "react-router-dom";
import useStore from "../../services/store";
import { GiDogHouse } from "react-icons/gi";

const CircularMenu: React.FC = () => {
  const { setCMenuStatus } = useStore();
  const [status, setStatus] = useState("hide");
  const navigate = useNavigate();
  const debouncedHide = debounce(() => {
    setStatus("hide");
  }, 3400);

  useEffect(() => {
    console.log(status)
    setCMenuStatus(status);
  }, [status]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const bottomThreshold = window.innerHeight - 144; // 144px from bottom
      const leftThreshold = 144; // 144px from left
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
        title="Add a Note!"
        onClick={() => onItemClick("/note/1")}
      >
        <div>
          <FaPencilAlt />
        </div>
      </li>
      <li
        style={{ "--i": 2 } as React.CSSProperties}
        title="Search for Anything!"
        onClick={() => onItemClick("/")}
      >
        <div>
          <FaHome />
        </div>
      </li>
      <li
        style={{ "--i": 3 } as React.CSSProperties}
        title="Configure Everything!"
        onClick={() => onItemClick("/settings")}
      >
        <div>
          <IoSettingsOutline />
        </div>
      </li>
      <li
        style={{ "--i": 4 } as React.CSSProperties}
        title="My Profile"
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
