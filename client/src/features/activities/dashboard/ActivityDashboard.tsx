import { SyntheticEvent } from "react";
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
  createActivity: (activity: IActivity) => void;
  editActivity: (activity: IActivity) => void;
  deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void;
  submitting: boolean;
  target: string;
}

const ActivityDashboard: React.FC<IProps> = ({
  activities,
  selectActivity,
  selectedActivity,
  setSelectedActivity,
  editMode,
  setEditMode,
  createActivity,
  editActivity,
  deleteActivity,
  submitting,
  target
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList 
        activities={activities} 
        selectActivity={selectActivity} 
        deleteActivity={deleteActivity}
        submitting={submitting}
        target={target}
        />
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
          <ActivityForm 
          // key to update the state and reset the form when hitting createActivity when Edit Form is open already
          key={(selectedActivity && selectedActivity.id) || 0}
          setEditMode={setEditMode} 
          activity={selectedActivity!} 
          createActivity={createActivity}
          editActivity={editActivity}
          submitting={submitting}
          />
          // ! after selectedActivity bypasses a warning from TypeScript. 
        )}
      </Grid.Column>
    </Grid>
  );
};

export default ActivityDashboard;
