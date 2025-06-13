// Profile.tsx
import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaCog } from "react-icons/fa";
import { IoLanguage, IoFlashlight } from "react-icons/io5";
import FlexBetween from "../UI/FlexBetween";
import useStore from "../../services/store";
import { CONSTANTS } from "../../const";
import defaultProfilePicture from "../../assets/defaultProfile.jpg";
import {
  ProfileContainer,
  ProfileSettingsButton,
  MediaQueryContainer,
  ProfileLight,
  ProfileHeader,
  ProfilePicture,
  InputGroup,
  ProfileInputContainer,
  ProfileButton,
} from "./style";
import "./Profile.css";
import { User } from "../../types/User";

interface SaveUserData {
  name?: string;
  nickName?: string;
  language?: string;
  password?: string;
  hint?: string;
  profilePicture?: File | null;
  id?: number;
}

interface ProfileFormData {
  id?: number;
  name: string;
  nickName: string;
  language: string;
  profilePicture?: File | null;
}

interface Language {
  id: string;
  code: string;
  label: string;
}

interface UseSaveUserReturn {
  saveUser: (userData: SaveUserData) => Promise<void>;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

interface SaveUserResponse {
  user: User;
  message?: string;
}

interface ProfilePictureSectionProps {
  profilePictureUrl: string;
  onDivClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: (key: string) => string;
}

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

interface ProfileFormSectionProps {
  formData: ProfileFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSubmit: () => Promise<void>;
  isEditing: boolean;
  isLoading: boolean;
  onLanguageChange: (language: string) => void;
  t: (key: string) => string;
}

// ==================== CONSTANTS ====================
const SUPPORTED_LANGUAGES: Language[] = [
  { id: "1", code: "en", label: "En" },
  { id: "2", code: "fr", label: "Fr" },
  { id: "3", code: "sp", label: "Sp" },
  { id: "4", code: "jp", label: "Jp" },
  { id: "5", code: "ar", label: "Ar" },
  { id: "6", code: "ru", label: "Ru" },
] as const;

// ==================== CUSTOM HOOK ====================
const useSaveUser = (): UseSaveUserReturn => {
  const { setUser } = useStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const saveUser = async (userData: SaveUserData): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();

      // Append form data with proper defaults
      formData.append("name", userData.name ?? "");
      formData.append("nick_name", userData.nickName ?? "");
      formData.append("language", userData.language ?? "en");
      formData.append("password", userData.password ?? "");
      formData.append("hint", userData.hint ?? "#000");

      if (userData.profilePicture) {
        formData.append("profile_picture", userData.profilePicture);
      }

      if (userData.id !== undefined) {
        formData.append("id", userData.id.toString());
      }

      const response = await fetch(`${CONSTANTS.BackURL}/save-user`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`,
        );
      }

      const data: SaveUserResponse = await response.json();
      const { user } = data;

      // Update user in store
      setUser({
        id: user.id,
        name: user.name,
        nickName: user.nickName,
        hint: user.hint,
        password: user.password,
        language: user.language,
      });

      setSuccessMessage("Profile saved successfully");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error saving user:", err);
    } finally {
      setLoading(false);
    }
  };

  return { saveUser, loading, error, successMessage };
};

// ==================== SERVICE ====================
class ProfileService {
  static async fetchUserProfilePicture(userId: number): Promise<File | null> {
    try {
      const response = await fetch(
        `${CONSTANTS.BackURL}/user/${userId}/profile-picture`,
      );

      if (response.ok) {
        const blob = await response.blob();
        return new File([blob], "profile-picture.jpg", {
          type: blob.type,
          lastModified: Date.now(),
        });
      } else {
        console.warn("Failed to fetch profile picture:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      return null;
    }
  }
}

// ==================== SUB-COMPONENTS ====================
const ProfilePictureSection: React.FC<ProfilePictureSectionProps> = ({
  profilePictureUrl,
  onDivClick,
  fileInputRef,
  onFileChange,
  t,
}) => (
  <FlexBetween width="38.2vw" height="38.2vh" justifyContent="center">
    <MediaQueryContainer>
      <ProfileLight $position="left">
        <IoFlashlight />
      </ProfileLight>
      <ProfileLight $position="right">
        <IoFlashlight />
      </ProfileLight>
      <ProfileHeader>{t("Profile")}</ProfileHeader>
      <ProfilePicture $url={profilePictureUrl} onClick={onDivClick}>
        <input
          ref={fileInputRef}
          hidden
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
      </ProfilePicture>
    </MediaQueryContainer>
  </FlexBetween>
);

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => (
  <div className="language-container">
    <div className="language-tabs">
      <label className="lang-label">
        <IoLanguage />
      </label>
      {SUPPORTED_LANGUAGES.map(({ id, code, label }: Language) => (
        <React.Fragment key={id}>
          <input
            type="radio"
            id={`radio-${id}`}
            name="language"
            checked={selectedLanguage === code}
            onChange={() => onLanguageChange(code)}
          />
          <label className="language-tab" htmlFor={`radio-${id}`}>
            {label}
          </label>
        </React.Fragment>
      ))}
      <span className="glider" />
    </div>
  </div>
);

const ProfileFormSection: React.FC<ProfileFormSectionProps> = ({
  formData,
  onChange,
  onCancel,
  onSubmit,
  isEditing,
  isLoading,
  onLanguageChange,
  t,
}) => {
  const handleSubmit = async (): Promise<void> => {
    await onSubmit();
  };

  return (
    <FlexBetween
      width="38.2vw"
      height="61.8vh"
      direction="column"
      padding="13px"
    >
      <InputGroup>
        <input
          autoFocus
          type="text"
          required
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
        />
        <label htmlFor="name">{t("Name")}</label>
      </InputGroup>

      <InputGroup>
        <input
          type="text"
          required
          id="nickName"
          name="nickName"
          value={formData.nickName}
          onChange={onChange}
        />
        <label htmlFor="nickName">{t("NickName")}</label>
      </InputGroup>

      <LanguageSelector
        selectedLanguage={formData.language}
        onLanguageChange={onLanguageChange}
      />

      {isEditing && (
        <ProfileInputContainer>
          <ProfileButton onClick={onCancel} disabled={isLoading}>
            {t("cancel")}
          </ProfileButton>
          <ProfileButton onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? t("saving") : t("save")}
          </ProfileButton>
        </ProfileInputContainer>
      )}
    </FlexBetween>
  );
};

// ==================== MAIN COMPONENT ====================
const Profile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, userAction, setUserAction } = useStore();
  const { saveUser, loading, error } = useSaveUser();
  const navigate = useNavigate();

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    nickName: "",
    language: "en",
    id: undefined,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const profilePictureUrl: string = useMemo(() => {
    return profilePicture
      ? URL.createObjectURL(profilePicture)
      : defaultProfilePicture;
  }, [profilePicture]);

  const isEditing: boolean = userAction === "editing profile";

  const fetchUserProfilePicture = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    const profilePictureFile = await ProfileService.fetchUserProfilePicture(
      user.id,
    );
    if (profilePictureFile) {
      setProfilePicture(profilePictureFile);
    }
  }, [user?.id]);

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        nickName: user.nickName || "",
        language: user.language || "en",
        id: user.id,
      });
      fetchUserProfilePicture();
    }
  }, [user, fetchUserProfilePicture]);

  // Handle form input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setUserAction("editing profile");
    },
    [setUserAction],
  );

  // Handle file upload
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const file = e.target.files?.[0] || null;
      setProfilePicture(file);
      setUserAction("editing profile");
    },
    [setUserAction],
  );

  // Handle profile picture click
  const handleProfilePictureClick = useCallback((): void => {
    fileInputRef.current?.click();
  }, []);

  // Handle language change
  const handleLanguageChange = useCallback(
    (language: string): void => {
      i18n.changeLanguage(language);
      setFormData((prev) => ({ ...prev, language }));
      setUserAction("editing profile");
    },
    [i18n, setUserAction],
  );

  // Handle form submission
  const handleSubmit = useCallback(async (): Promise<void> => {
    try {
      const completeFormData = { ...formData, profilePicture };
      await saveUser(completeFormData);
      setUserAction("neutral");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  }, [formData, profilePicture, saveUser, setUserAction]);

  // Handle form cancellation
  const handleCancel = useCallback((): void => {
    setUserAction("neutral");
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || "",
        nickName: user.nickName || "",
        language: user.language || "en",
        id: user.id,
      });
      // Reset profile picture to original
      fetchUserProfilePicture();
    }
  }, [setUserAction, user, fetchUserProfilePicture]);

  // Handle settings navigation
  const handleSettingsClick = useCallback((): void => {
    navigate("/settings");
  }, [navigate]);

  // Display error if present
  useEffect(() => {
    if (error) {
      console.error("Profile error:", error);
      // You might want to show a toast notification here
    }
  }, [error]);

  // Cleanup object URL when component unmounts or profilePicture changes
  useEffect(() => {
    return () => {
      if (profilePicture && profilePictureUrl !== defaultProfilePicture) {
        URL.revokeObjectURL(profilePictureUrl);
      }
    };
  }, [profilePicture, profilePictureUrl]);

  return (
    <ProfileContainer
      width="38.2vw"
      height="100vh"
      direction="column"
      className="profile-container"
      padding="0.81rem"
    >
      <ProfileSettingsButton onClick={handleSettingsClick}>
        <FaCog size="1.1rem" />
      </ProfileSettingsButton>

      <ProfilePictureSection
        profilePictureUrl={profilePictureUrl}
        onDivClick={handleProfilePictureClick}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
        t={t}
      />

      <ProfileFormSection
        formData={formData}
        onChange={handleInputChange}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        isLoading={loading}
        onLanguageChange={handleLanguageChange}
        t={t}
      />
    </ProfileContainer>
  );
};

export default Profile;
