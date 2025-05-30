import React, { useState, useRef, useMemo, useEffect } from "react";
import FlexBetween from "../UI/FlexBetween";
import useSaveUser from "../../hooks/useSaveUser";
import "./Profile.css";
import defaultProfilePicture from "../../assets/defaultProfile.jpg";
import { IoLanguage, IoFlashlight } from "react-icons/io5";
import useStore from "../../services/store";
import { CONSTANTS } from "../../const";
import { useTranslation } from "react-i18next";

export interface FormData {
  id?: number;
  name?: string;
  nickName?: string;
  language: string;
  profilePicture?: File | null;
}

// ----------------- Subcomponents ---------------------

const ProfilePictureSection = ({
  profilePictureUrl,
  handleDivClick,
  fileInputRef,
  handleFileChange,
  t,
}: any) => (
  <FlexBetween width="38.2vw" height="38.2vh" justifyContent="center">
    <div className="profile-picture-container">
      <div className="profile-light profile-light-left">
        <IoFlashlight />
      </div>
      <div className="profile-light profile-light-right">
        <IoFlashlight />
      </div>
      <h3 className="profile-header">{t("Profile")}</h3>
      <div
        className="profile-picture"
        style={{ backgroundImage: `url(${profilePictureUrl})` }}
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
);

const LanguageSelector = ({ language, handleLanguageChange }: any) => (
  <div className="language-container">
    <div className="language-tabs">
      <label className="lang-label">
        <IoLanguage />
      </label>
      {[
        { id: "1", code: "en", label: "En" },
        { id: "2", code: "fr", label: "Fr" },
        { id: "3", code: "sp", label: "Sp" },
        { id: "4", code: "jp", label: "Jp" },
        { id: "5", code: "ar", label: "Ar" },
      ].map(({ id, code, label }) => (
        <React.Fragment key={id}>
          <input
            type="radio"
            id={`radio-${id}`}
            name="language"
            checked={language === code}
            onChange={() => handleLanguageChange(code)}
          />
          <label className="language-tab" htmlFor={`radio-${id}`}>
            {label}
          </label>
        </React.Fragment>
      ))}
      <span className="glider"></span>
    </div>
  </div>
);

const ProfileFormSection = ({
  formData,
  handleChange,
  handleCancel,
  handleSubmit,
  userAction,
  loading,
  handleLanguageChange,
  t,
}: any) => (
  <FlexBetween
    width="38.2vw"
    height="61.8vh"
    direction="column"
    padding="13px"
  >
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
      <label htmlFor="name">{t("Name")}</label>
    </div>

    <div className="inputGroup">
      <input
        type="text"
        required
        id="nickName"
        name="nickName"
        value={formData.nickName}
        onChange={handleChange}
      />
      <label htmlFor="nickName">{t("NickName")}</label>
    </div>

    <LanguageSelector
      language={formData.language}
      handleLanguageChange={handleLanguageChange}
    />

    {userAction === "editing profile" && (
      <div className="profile-input-container">
        <button onClick={handleCancel} disabled={loading}>
          {t("Cancel")}
        </button>
        <button onClick={handleSubmit} disabled={loading}>
          {t("Save")}
        </button>
      </div>
    )}
  </FlexBetween>
);

// ----------------- Main Component ---------------------

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { user, userAction, setUserAction } = useStore();
  const { saveUser, loading } = useSaveUser();

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    nickName: "",
    language: "en",
    id: undefined,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const profilePictureUrl = useMemo(() => {
    return profilePicture
      ? URL.createObjectURL(profilePicture)
      : defaultProfilePicture;
  }, [profilePicture]);

  const getUserProfilePicture = async () => {
    try {
      const response = await fetch(
        `${CONSTANTS.BackURL}/user/${user?.id}/profile-picture`,
      );
      if (response.ok) {
        const blob = await response.blob();
        const file = new File([blob], "profile-picture.jpg", {
          type: blob.type,
          lastModified: new Date().getTime(),
        });
        setProfilePicture(file);
      } else {
        console.error("Failed to fetch profile picture");
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        nickName: user.nickName || "",
        language: user.language || "en",
        id: user.id,
      });
      getUserProfilePicture();
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setUserAction("editing profile");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setProfilePicture(file);
    setUserAction("editing profile");
  };

  const handleDivClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setFormData((prev) => ({ ...prev, language }));
    setUserAction("editing profile");
  };

  const handleSubmit = async () => {
    const completeFormData = { ...formData, profilePicture };
    await saveUser(completeFormData);
    setUserAction("neutral");
  };

  const handleCancel = () => {
    setUserAction("neutral");
  };

  return (
    <FlexBetween
      width="38.2vw"
      height="100vh"
      direction="column"
      className="profile-container"
      padding="0.81rem"
    >
      <ProfilePictureSection
        profilePictureUrl={profilePictureUrl}
        handleDivClick={handleDivClick}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        t={t}
      />
      <ProfileFormSection
        formData={formData}
        handleChange={handleChange}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        userAction={userAction}
        loading={loading}
        handleLanguageChange={handleLanguageChange}
        t={t}
      />
    </FlexBetween>
  );
};

export default Profile;
