import { useState, useEffect, Fragment, SyntheticEvent, useContext } from "react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { IActivity } from "../models/activity";
import { Container } from "semantic-ui-react";
import "./styles.css";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import ActivityStore from '../stores/activityStore';
import { observer } from "mobx-react-lite";

const App = () => {
  const activityStore = useContext(ActivityStore);
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);
  // [] makes sure the useEffect never runs more than once

  if (activityStore.loadingInitial) return <LoadingComponent content='Loading Activities...'/>;

  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
};

// the app now serves as an observer of the activity store
export default observer(App);
