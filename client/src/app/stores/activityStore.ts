// Store that loads our activities
import { action, observable, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import { toast } from "react-toastify";
import { history } from "../..";
import agent from "../api/agent";
import { createAttendee, setActivityProps } from "../common/util/util";
import { IActivity } from "../models/activity";
import { RootStore } from "./rootStore";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";
  @observable loading = false;
  @observable.ref hubConnection: HubConnection | null = null; // only observes a reference to the hub connection

  @action createHubConnection = (activityId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/chat", {
        accessTokenFactory: () => this.rootStore.commonStore.token!,
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() =>
        console.log("Hub Connection State", this.hubConnection!.state))
      .then(() => {
        console.log('attempting to join group');
        this.hubConnection!.invoke('AddToGroup', activityId)
      })
      .catch((error) => console.log("Error establishing connection: ", error));

      // when we receive a comment
      this.hubConnection.on('ReceiveComment', comment => {
        runInAction("Receiving Comments", () => {
          this.activity!.comments.push(comment);
        });
      })

      this.hubConnection.on('Send', message => {
        toast.info(message);
      })
  };

  @action stopHubConnection = () => {
    this.hubConnection!.invoke('RemoveFromGroup', this.activity!.id)
      .then(() => {
        this.hubConnection!.stop(); // allows us to turn off the hubConnection of the user
      })
      .then(() => console.log('Connection has stopped.'))
      .catch(error => console.log('error', error))
  };

  @action addComment = async (values: any) => {
    values.activityId = this.activity!.id; // values.activityId needs to match the Create comment class
    try {
      await this.hubConnection!.invoke("SendComment", values); // SendComment needs to match the SendComment method in the ChatHub class
    } catch (error) {
      console.log('error', error);
    };
  };

  //computed when the data is already in the store, and work out the result for the existing data
  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  // Hope will be each unique date has an array to be able to group each event
  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  @action loadActivities = async () => {
    this.loadingInitial = true; // Starts the loading indicator
    try {
      const activities = await agent.Activities.list();
      runInAction("load activities", () => {
        activities.forEach((activity) => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.id, activity); // to match with the observable activities
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("load activities errors", () => {
        this.loadingInitial = false;
      });
      console.log("error", error);
    }
  };

  @action loadActivity = async (id: string) => {
    // SCENARIOS TO ACCOUNT FOR
    // A user clicks on the view button on the activity list
    // A user clicks on the view button, but goes to refresh the page to access the page directly
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction("getting activity", () => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activity = activity;
          this.activityRegistry.set(activity.id, activity); // to match with the observable activities
          this.loadingInitial = false;
        });
        return activity;
      } catch (error) {
        runInAction("getting activity error", () => {
          this.loadingInitial = false;
        });
        console.log("error", error);
      }
    }
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      // This makes sure the created user of the activity will be the host
      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      activity.attendees = attendees;
      activity.comments = []; // in order to create a new activity, then also add comments
      activity.isHost = true; // sets the flag for immediate submit
      runInAction("create activity", () => {
        this.activityRegistry.set(activity.id, activity); // to match with the observable activities
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction("create activity error", () => {
        this.submitting = false;
      });
      toast.error("Problem Submitting Data");
      console.log("error", error.response);
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("edit activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction("edit activity error", () => {
        this.submitting = false;
      });
      console.log("error", error);
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction("delete activity", () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      runInAction("delete activity error", () => {
        this.submitting = false;
        this.target = "";
      });
      console.log("error", error);
    }
  };

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    try {
      await agent.Activities.attend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem Signing up to Activity");
    }
  };

  @action cancelAttendance = async () => {
    this.loading = true;
    try {
      await agent.Activities.unattend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            (a) => a.username !== this.rootStore.userStore.user!.username
          );
          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem Cancelling Attendance");
    }
  };
}
