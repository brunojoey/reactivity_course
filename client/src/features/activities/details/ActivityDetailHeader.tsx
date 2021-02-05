import React, { useContext } from "react";
import { IActivity } from "../../../app/models/activity";
import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Button, Header, Item, Segment, Image } from "semantic-ui-react";
import { RootStoreContext } from "../../../app/stores/rootStore";

const activityImageStyle = {
  filter: "brightness(30%)",
};

const activityImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};

const ActivityDetailHeader: React.FC<{ activity: IActivity }> = ({
  activity,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {attendActivity, cancelAttendance, loading} = rootStore.activityStore;
  return (
    <div>
      <Segment.Group>
        <Segment basic attached="top" style={{ padding: "0" }}>
          <Image
            src={`/assets/categoryImages/${activity.category}.jpg`}
            fluid
            style={activityImageStyle}
          />
          {/* Without the basic part, the image text would have the default styling covering the image where not needed */}
          <Segment basic style={activityImageTextStyle}>
            <Item.Group>
              <Item>
                <Item.Content>
                  <Header
                    size="huge"
                    content={activity.title}
                    style={{ color: "white" }}
                  />
                  <p>{format(activity.date, "eeee do MMMM")}</p>
                  <p>
                    Hosted by <strong>Bob</strong>
                  </p>
                </Item.Content>
              </Item>
            </Item.Group>
          </Segment>
        </Segment>
        <Segment clearing attached="bottom">
          {activity.isHost ? (
            <Button
              as={Link}
              to={`/manage/${activity.id}`}
              color="orange"
              floated="right"
            >
              Manage Event
            </Button>
          ) : activity.isGoing ? (
            <Button loading={loading} onClick={cancelAttendance}>Cancel Attendance</Button>
          ) : (
            <Button loading={loading} onClick={attendActivity} color="teal">Join Activity</Button>
          )}
        </Segment>
      </Segment.Group>
    </div>
  );
};

export default observer(ActivityDetailHeader);
