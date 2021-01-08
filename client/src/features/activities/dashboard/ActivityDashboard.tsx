import { SyntheticEvent, useContext } from "react";
import { Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from "mobx-react-lite";

interface IProps {
  setSelectedActivity: (activity: IActivity | null) => void;
  setEditMode: (editMode: boolean) => void;
  editActivity: (activity: IActivity) => void;
  deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void;
  submitting: boolean;
  target: string;
}

const ActivityDashboard: React.FC<IProps> = ({
  setSelectedActivity,
  setEditMode,
  editActivity,
  deleteActivity,
  submitting,
  target
}) => {
  const activityStore = useContext(ActivityStore);
  const { editMode, selectedActivity } = activityStore;


  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList 
        deleteActivity={deleteActivity}
        submitting={submitting}
        target={target}
        />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedActivity && !editMode && (
          <ActivityDetails
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
          editActivity={editActivity}
          submitting={submitting}
          />
          // ! after selectedActivity bypasses a warning from TypeScript. 
        )}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
