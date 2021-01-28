import { useContext, useEffect } from "react";
import { RootStoreContext } from "../../../app/stores/rootStore";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityDetailChat from "./ActivityDetailChat";
import ActivityDetailHeader from "./ActivityDetailHeader";
import ActivityDetailInfo from "./ActivityDetailInfo";
import ActivityDetailSidebar from "./ActivityDetailSidebar";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Grid } from "semantic-ui-react";

interface DetailParams {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const rootStore = useContext(RootStoreContext);
  const { activity, loadActivity, loadingInitial } = rootStore.activityStore;

  useEffect(() => {
    loadActivity(match.params.id)
  }, [loadActivity, match.params.id]);

  if (loadingInitial || !activity)
    return <LoadingComponent content="Loading Activity..." />;

  if (!activity)
    return <h2>Activity Not Found</h2>;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailHeader activity={activity}/>
        <ActivityDetailInfo activity={activity} />
        <ActivityDetailChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailSidebar />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
