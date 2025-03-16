import React, { useState, useRef, useMemo, useEffect } from "react";
import FlexBetween from "../UI/FlexBetween";
import useSaveUser from "../../hooks/useSaveUser";
import "./Profile.css";
import defaultProfilePicture from "../../assets/defaultProfile.jpg";
import { IoLanguage, IoFlashlight } from "react-icons/io5";
import useStore from "../../services/store";
import { CONSTANTS } from "../../const";

export interface FormData {
  id?: number; // Optional number or undefined
  name?: string; // Required string
  nickName?: string; // Optional string
  password?: string; // Optional string
  language: string; // Required string with initial default
  hint?: string; // Optional string
  profilePicture?: File | null; // Optional File, null, or undefined
}

const Profile = () => {
  const { user } = useStore();
  const { saveUser, loading } = useSaveUser();
  const { userAction, setUserAction } = useStore();

  const getUserProfilePicture = async () => {
    try {
      const response = await fetch(
        `${CONSTANTS.BackURL}/user/${user?.id}/profile-picture`
      );
      if (response.ok) {
        const blob = await response.blob();

        // Create a File from the Blob
        const file = new File([blob], "profile-picture.jpg", {
          type: blob.type,
          lastModified: new Date().getTime(),
        });

        setProfilePicture(file); // Set it as File in state
      } else {
        console.error("Failed to fetch profile picture");
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  const [formData, setFormData] = useState<FormData>({
    name: "", // Required but can be empty
    nickName: "", // Optional but initially an empty string
    password: "", // Optional but initially an empty string
    language: "en", // Required with "en" as default
    hint: "#000", // Optional but set to a default
    id: undefined, // Optional and undefined initially
  });
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        nickName: user.nickName || "",
        password: "",
        language: user.language || "en",
        hint: user.hint || "#000",
        id: user.id,
      });

      // Fetch the profile picture when user is loaded
      getUserProfilePicture();
    }
  }, [user]);

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const profilePictureUrl = useMemo(() => {
    return profilePicture
      ? URL.createObjectURL(profilePicture)
      : defaultProfilePicture;
  }, [profilePicture]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setUserAction("editing profile");
  };

  // Handle hint color change
  const handleHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, hint: e.target.value }));
    setUserAction("editing profile");
  };

  // Handle profile picture selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setProfilePicture(file);
    setUserAction("editing profile");
  };

  // Open file input when profile picture div is clicked
  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle language change
  const handleLanguageChange = (language: string) => {
    setFormData((prev) => ({ ...prev, language }));
    setUserAction("editing profile");
  };

  // Handle form submission
  const handleSubmit = async () => {
    const completeFormData = { ...formData, profilePicture };
    await saveUser(completeFormData);
    setUserAction("neutral");
  };

  // Handle form cancel
  const handleCancel = () => {
    setUserAction("neutral");
  };

  return (
    <FlexBetween
      width="377px"
      height="100%"
      direction="column"
      className="profile-container"
      padding="13px"
    >
      {/* Profile Picture Section */}
      <FlexBetween width="377px" height="233px" justifyContent="center">
        <div className="profile-picture-container">
          <div className="profile-light profile-light-left">
            <IoFlashlight />
          </div>
          <div className="profile-light profile-light-right">
            <IoFlashlight />
          </div>
          <h3 className="profile-header">Profile</h3>
          <div
            className="profile-picture"
            style={{
              backgroundImage: `url(${profilePictureUrl})`,
            }}
            onClick={handleDivClick}
          >
            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </FlexBetween>

      {/* Profile Form Section */}
      <FlexBetween
        width="377px"
        height="377px"
        direction="column"
        padding="13px"
      >
        {/* Name Input */}
        <div className="inputGroup">
          <input
            autoFocus
            type="text"
            required
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <label htmlFor="name">Name</label>
        </div>

        {/* Nickname Input */}
        <div className="inputGroup">
          <input
            type="text"
            required
            id="nickName"
            name="nickName"
            value={formData.nickName}
            onChange={handleChange}
          />
          <label htmlFor="nickName">NickName</label>
        </div>

        {/* Password Input */}
        <div className="inputGroup">
          <input
            type="password"
            required
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <label htmlFor="password">
            {user?.password ? "Change " : ""}Password
          </label>
        </div>

        {/* Language Selection and Hint Input */}
        <div className="language-container">
          <div className="language-tabs">
            <label className="lang-label">
              <IoLanguage />
            </label>
            <input
              type="radio"
              id="radio-1"
              name="language"
              checked={formData.language === "en"}
              onChange={() => handleLanguageChange("en")}
            />
            <label className="language-tab" htmlFor="radio-1">
              En
            </label>

            <input
              type="radio"
              id="radio-2"
              name="language"
              checked={formData.language === "fr"}
              onChange={() => handleLanguageChange("fr")}
            />
            <label className="language-tab" htmlFor="radio-2">
              Fr
            </label>

            <input
              type="radio"
              id="radio-3"
              name="language"
              checked={formData.language === "sp"}
              onChange={() => handleLanguageChange("sp")}
            />
            <label className="language-tab" htmlFor="radio-3">
              Sp
            </label>

            <input
              type="radio"
              id="radio-4"
              name="language"
              checked={formData.language === "jp"}
              onChange={() => handleLanguageChange("jp")}
            />
            <label className="language-tab" htmlFor="radio-4">
              Jp
            </label>
            <span className="glider"></span>
          </div>

          {/* Hint Color Input */}
          <div className="hint-container">
            <label className="hint-label">Hint</label>
            <input
              type="color"
              className="hint-input"
              value={formData.hint}
              onChange={handleHintChange}
              style={{ backgroundColor: formData.hint }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        {userAction === "editing profile" && (
          <div className="profile-input-container">
            <button onClick={handleCancel} disabled={loading}>
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading}>
              Save
            </button>
          </div>
        )}
      </FlexBetween>
    </FlexBetween>
  );
};

export default Profile;
