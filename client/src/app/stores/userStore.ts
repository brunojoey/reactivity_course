import { action, computed, observable, runInAction } from "mobx";
import agent from "../api/agent";
import { IUser, IUserFormValues } from "../models/user";
import { RootStore } from "./rootStore";
import { history } from '../..';

export default class UserStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  };

  @observable user: IUser | null = null;

  @computed get isLoggedIn() {return !!this.user};

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);
      runInAction(() => {
        this.user = user; // assigns user login to user observable
      }) 
      this.rootStore.commonStore.setToken(user.token)
      history.push('/activities');
    } catch (error) {
      throw error;
    };
  };

  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
  }
};
