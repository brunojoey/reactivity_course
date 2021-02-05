// General purpose for helper methods

import { IActivity, IAttendee } from "../../models/activity";
import { IUser } from "../../models/user";

export const combineDateAndTime = (date: Date, time: Date) => {
  const timeString = time.getHours() + ":" + time.getMinutes() + ":00";

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // Get Date will give us the date, getDay will get us the day whereas we don't want that.
  const dateString = `${year}-${month}-${day}`;
  return new Date(dateString + " " + timeString);
};

export const setActivityProps = (activity: IActivity, user: IUser) => {
  // When loading a date it will always use a javascript date object
  activity.date = new Date(activity.date);
  activity.isGoing = activity.attendees.some(
    (a) => a.username === user.username
  );
  activity.isHost = activity.attendees.some(
    (a) => a.username === user.username && a.isHost
  );
  return activity;
};

export const createAttendee = (user: IUser): IAttendee => {
  return {
    displayName: user.displayName,
    isHost: false,
    username: user.username,
    image: user.image!
  }
}
