//////////////////////
// IMPORTS
/////////////////////
// libraries
import { observable, action, configure } from 'mobx';
// config
configure({ enforceActions: "always" });

//////////////////////
// STORE
/////////////////////
export class SetupDialogStore {
  // SETUP
  private slackTokenKey = 'slackToken';

  // OBSERVABLES
  @observable
  public isOpen = false;

  @observable
  public slackToken = window.localStorage.getItem(this.slackTokenKey) || undefined;

  // ACTIONS
  @action
  openDialog = () => {
    this.isOpen = true;
  }

  @action
  closeDialog = () => {
    this.isOpen = false;
  }

  @action
  setSlackToken = (token: string) => {
    this.slackToken = token;
    window.localStorage.setItem(this.slackTokenKey, this.slackToken);
  }
}