// This Store will handle our modal store functionality
import { action, observable } from "mobx";
import { RootStore } from "./rootStore";

export default class ModalStore {
  rootStore: RootStore;
  constructor (rootStore: RootStore) {
    this.rootStore = rootStore;
  };

  // Shallow only observes the first level, in the case of a null section which would want to see deeply
  @observable.shallow modal = {
    open: false,
    body: null
  };

  @action openModal = (content: any) => {
    this.modal.open = true;
    this.modal.body = content;
  };

  @action closeModal = () => {
    this.modal.open = false;
    this.modal.body = null;
  };
}