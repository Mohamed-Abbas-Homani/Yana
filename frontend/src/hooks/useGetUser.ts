import { useState, useEffect } from "react";
import useStore from "../services/store";
import { CONSTANTS } from "../const";

const useGetUser = () => {
  const { user, setUser } = useStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${CONSTANTS.BackURL}/user/${user?.id}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {

      fetchUser();
    }
  }, [user]); // Dependency on userId to refetch if it changes

  return { user, loading, error };
};

export default useGetUser;
