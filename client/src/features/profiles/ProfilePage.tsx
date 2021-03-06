import ProfileHeader from "./ProfileHeader";
import ProfileContents from "./ProfileContents";
import { Grid } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";

interface RouteParams {
  username: string;
};

interface IProps extends RouteComponentProps<RouteParams> {}

const ProfilePage: React.FC<IProps> = ({ match }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingProfile,
    profile,
    loadProfile,
    follow,
    unfollow,
    isCurrentUser,
    loading,
    setActiveTab
  } = rootStore.profileStore;

  useEffect(() => {
    loadProfile(match.params.username);
  }, [loadProfile, match]);

  if (loadingProfile) return <LoadingComponent content="Loading Profile" />;

  return (
    <div>
      <Grid>
        <Grid.Column width={16}>
          <ProfileHeader
            profile={profile!}
            isCurrentUser={isCurrentUser}
            loading={loading}
            follow={follow}
            unfollow={unfollow}
          />
          <ProfileContents setActiveTab={setActiveTab}/>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default observer(ProfilePage);
