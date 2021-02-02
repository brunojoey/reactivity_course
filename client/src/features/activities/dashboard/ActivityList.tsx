import React, { Fragment, useContext } from "react";
import ActivityListItem from "./ActivityListItem";
import { observer } from "mobx-react-lite";
import { Item, Label } from "semantic-ui-react";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { format } from 'date-fns';

const ActivityList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { activitiesByDate } = rootStore.activityStore;

  return (
    <Fragment>
      {activitiesByDate.map(([group, activities]) => (
        <Fragment key={group}>
          <Label size="large" color="blue">
            {format(Date.parse(group), 'eeee do MMMM, yyyy')}
          </Label>
          <Item.Group divided>
            {activities.map((activity) => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
