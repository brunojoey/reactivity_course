import React, { useContext, useEffect, useState } from "react";
import ActivityList from "./ActivityList";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Grid, Loader } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/rootStore";
import InfiniteScroll from 'react-infinite-scroller';
import ActivityFilters from "./ActivityFilters";

const ActivityDashboard: React.FC = () => {
  const [loadingNext, setLoadingNext] = useState(false);
  const rootStore = useContext(RootStoreContext);
  const {loadActivities, loadingInitial, setPage, page, totalPages} = rootStore.activityStore;

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page + 1); // in our activityStore
    loadActivities().then(() => setLoadingNext(false));
  };
  
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);
  // [] makes sure the useEffect never runs more than once

  if (loadingInitial && page === 0)
    return <LoadingComponent content="Loading Activities..." />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <InfiniteScroll
          pageStart={0}
          loadMore={handleGetNext}
          hasMore={!loadingNext && page + 1 < totalPages}
          initialLoad={false}
        >
          <ActivityList />
        </InfiniteScroll>
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
