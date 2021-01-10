import { action, observable, computed } from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";
import { IActivity } from "../models/activity";

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitting = false;
  @observable target = '';

  //computed when the data is already in the store, and work out the result for the existing data
  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
  };

  @action loadActivities = async () => {
    this.loadingInitial = true; // Starts the loading indicator
    try {
      const activities = await agent.Activities.list();
      activities.forEach(activity => {
        activity.date = activity.date.split('.')[0];
        this.activityRegistry.set(activity.id, activity); // to match with the observable activities
      });
      this.loadingInitial = false;
    } catch (error) {
      console.log('error', error)
      this.loadingInitial = false;
    }
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      this.activityRegistry.set(activity.id, activity); // to match with the observable activities
      this.editMode = false;
      this.submitting = false;
    } catch (error) {
      this.submitting = false;
      console.log('error', error)
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      this.activityRegistry.set(activity.id, activity);
      this.selectedActivity = activity;
      this.editMode = false;
      this.submitting = false;
    } catch (error) {
      this.submitting = false;
      console.log('error', error);
    };
  };

  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      this.activityRegistry.delete(id);
      this.submitting = false;
      this.target = '';
    } catch (error) {
      this.submitting = false;
      this.target = '';
      console.log('error', error)
    };
  };

  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = true;
  };

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  @action cancelFormOpen = () => {
    this.editMode = false;
  }

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  };
};

export default createContext(new ActivityStore());