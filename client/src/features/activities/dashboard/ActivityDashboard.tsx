import React from "react";
import { Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

interface IProps {
  activities: IActivity[];
  selectActivity: (id: String) => void;
  selectedActivity: IActivity | null;
  // | null will override the type safety. Wil define it as an activity or null. If not there, the App tsx will sohw an error

}

const ActivityDashboard: React.FC<IProps> = ({
  activities,
  selectActivity,
  selectedActivity,
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList activities={activities} selectActivity={selectActivity} />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedActivity && <ActivityDetails activity={selectedActivity} />}
        <ActivityForm />
      </Grid.Column>
    </Grid>
  );
};

export default ActivityDashboard;
