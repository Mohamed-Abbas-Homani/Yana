import { useEffect } from "react";
import Profile from "../components/Profile/Profile";
import Statistics from "../components/Profile/Statistics";
import FlexBetween from "../components/UI/FlexBetween";
import Page from "../components/UI/Page";
import useStore from "../services/store";

const ProfilePage = () => {
  const { setLastPage } = useStore();

  useEffect(() => {
    setLastPage("/profile");
  }, []);
  return (
    <Page>
      <FlexBetween width="100%" height="100%">
        <Profile />
        <Statistics />
      </FlexBetween>
    </Page>
  );
};

export default ProfilePage;
