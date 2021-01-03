import { useState, useEffect, Fragment } from "react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { IActivity } from "../models/activity";
import { Container } from "semantic-ui-react";
import axios from "axios";
import "./styles.css";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );

  const handleSelectActivity = (id: String) => {
    setSelectedActivity(activities.filter((a) => a.id === id)[0]);
  };

  useEffect(() => {
    axios
      .get<IActivity[]>("http://localhost:5000/api/activities")
      .then((response) => {
        setActivities(response.data);
      });
  }, []);
  // [] makes sure the useEffect never runs more than once

  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
        />
      </Container>
    </Fragment>
  );
};

export default App;
