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
  // OBSERVABLES
  @observable
  public isOpen = false;

  // ACTIONS
  @action
  open = () => {
    this.isOpen = true;
  }

  @action
  close = () => {
    this.isOpen = false;
  }

  @action
  toggle = () => {
    this.isOpen = !this.isOpen;
  }
}