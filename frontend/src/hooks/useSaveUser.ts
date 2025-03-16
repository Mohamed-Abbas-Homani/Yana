import { useState } from "react";
import useStore from "../services/store";
import { CONSTANTS } from "../const";

const useSaveUser = () => {
  const { setUser } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  console.log("saving");
  const saveUser = async (userData: {
    name?: string;
    nickName?: string;
    language?: string;
    password?: string;
    hint?: string;
    profilePicture?: File | null;
    id?: number;
  }) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    console.log("saving");
    const formData = new FormData();
    formData.append("name", userData.name || "");
    formData.append("nick_name", userData.nickName || "");
    formData.append("language", userData.language || "en");
    formData.append("password", userData.password || "");
    formData.append("hint", userData.hint || "#000");

    if (userData.profilePicture) {
      formData.append("profile_picture", userData.profilePicture);
    }
    if (userData.id !== undefined) {
      formData.append("id", userData.id.toString());
    }
    console.log(userData)

    try {
      const response = await fetch(`${CONSTANTS.BackURL}/save-user`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const user = data.user;
      setUser({
        id: user.id,
        name: user.name,
        nickName: user.nickName,
        hint: user.hint,
        password: user.password,
        language: user.language,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { saveUser, loading, error, successMessage };
};

export default useSaveUser;
