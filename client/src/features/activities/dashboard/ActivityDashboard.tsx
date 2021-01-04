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
  setSelectedActivity: (activity: IActivity | null) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
}

const ActivityDashboard: React.FC<IProps> = ({
  activities,
  selectActivity,
  selectedActivity,
  setSelectedActivity,
  editMode,
  setEditMode,
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList activities={activities} selectActivity={selectActivity} />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedActivity && !editMode && (
          <ActivityDetails
            activity={selectedActivity}
            setEditMode={setEditMode}
            setSelectedActivity={setSelectedActivity}
          />
        )}
        {editMode && (
          <ActivityForm setEditMode={setEditMode} activity={selectedActivity!} />
          // ! after selectedActivity bypasses a warning from TypeScript. 
        )}
      </Grid.Column>
    </Grid>
  );
};

export default ActivityDashboard;
