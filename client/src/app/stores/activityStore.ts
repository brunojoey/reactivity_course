import { action, observable, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";
import { IActivity } from "../models/activity";

// this enables strict mode
configure({enforceActions: 'always'});

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activities: IActivity[] = [];
  @observable activity: IActivity | undefined;
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
      runInAction('load activities', () => {
        activities.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          this.activityRegistry.set(activity.id, activity); // to match with the observable activities
      });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction('load activities errors', () => {
        this.loadingInitial = false;
      });
      console.log('error', error)
    };
  };

  @action loadActivity = async (id: string) => {
    // SCENARIOS TO ACCOUNT FOR
    // A user clicks on the view button on the activity list
    // A user clicks on the view button, but goes to refresh the page to access the page directly
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction('getting activity', () => {
          this.activity = activity;
          this.loadingInitial = false;
        })
      } catch (error) {
        runInAction('getting activity error', () => {
          this.loadingInitial = false;
        })
        console.log('error', error);
      }
    }
  }

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction('create activity', () => {
        this.activityRegistry.set(activity.id, activity); // to match with the observable activities
        this.editMode = false;
        this.submitting = false;
      })
    } catch (error) {
      runInAction('create activity error', () => {
        this.submitting = false;
      });
      console.log('error', error)
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction('edit activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.editMode = false;
        this.submitting = false;
      })
    } catch (error) {
      runInAction('edit activity error', () => {
        this.submitting = false;
      })
      console.log('error', error);
    };
  };

  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction('delete activity', () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      })
    } catch (error) {
      runInAction('delete activity error', () => {
        this.submitting = false;
        this.target = '';
      })
      console.log('error', error)
    };
  };

  @action openEditForm = (id: string) => {
    this.activity = this.activityRegistry.get(id);
    this.editMode = true;
  };

  @action cancelSelectedActivity = () => {
    this.activity = undefined;
  };

  @action cancelFormOpen = () => {
    this.editMode = false;
  }

  @action openCreateForm = () => {
    this.editMode = true;
    this.activity = undefined;
  };

  @action selectActivity = (id: string) => {
    this.activity = this.activityRegistry.get(id);
    this.editMode = false;
  };
};

export default createContext(new ActivityStore());