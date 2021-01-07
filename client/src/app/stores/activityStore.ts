import { action, makeAutoObservable, observable } from "mobx";
import { createContext } from "react";
import agent from "../api/agent";
import { IActivity } from "../models/activity";

class ActivityStore {
  @observable activities: IActivity[] = [];
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable selectedActivity: IActivity | undefined;

  // Need this to render the lists since MobX has deprecated decorators such as observables directly
  constructor() {
    makeAutoObservable(this)
}

  // @action loadActivities = () => {
  //   this.loadingInitial = true; // Starts the loading indicator
  //   agent.Activities.list()
  //     .then(activities => {
  //       activities.forEach((activity) => {
  //         activity.date = activity.date.split('.')[0];
  //         this.activities.push(activity); // to match with the observable activities
  //       })
  //     }).finally(() => this.loadingInitial = false);
  // };

  @action loadActivities = async () => {
    this.loadingInitial = true; // Starts the loading indicator
    try {
      const activities = await agent.Activities.list();
      activities.forEach(activity => {
        activity.date = activity.date.split('.')[0];
        this.activities.push(activity); // to match with the observable activities
      });
      this.loadingInitial = false;
    } catch (error) {
      console.log(error);
      this.loadingInitial = false;
    }
  };

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activities.find(a => a.id === id);
    this.editMode = false;
  };
};

export default createContext(new ActivityStore());