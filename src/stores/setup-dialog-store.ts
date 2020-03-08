//////////////////////
// IMPORTS
/////////////////////
// libraries
import { observable, action, configure, runInAction } from 'mobx';
// internal
import { validateSlackToken } from '../api/slack-api';
// config
configure({ enforceActions: "always" });

//////////////////////
// STORE
/////////////////////
export class SetupDialogStore {
  // SETUP
  private slackTokenKey = 'slackToken';
  private slackTokenIsValidKey = 'slackTokenIsValid'

  // OBSERVABLES
  @observable
  public isOpen = false;

  @observable
  public isLoading = false;

  @observable
  public slackToken = window.localStorage.getItem(this.slackTokenKey) || undefined;

  @observable
  public slackTokenIsValid = !!(window.localStorage.getItem(this.slackTokenIsValidKey) === 'true');

  // ACTIONS
  @action
  openDialog = () => {
    this.isOpen = true;
  }

  @action
  async closeDialog() {
    await this.validateSlackToken();
    runInAction(() => {
      this.isOpen = !this.slackTokenIsValid;
    });
  }

  @action
  setSlackToken = (token: string) => {
    this.slackToken = token;
    window.localStorage.setItem(this.slackTokenKey, this.slackToken);
  }

  @action
  async validateSlackToken() {
    runInAction(() => {
      this.isLoading = true;
    });

    let isValid = false;
    try {
      isValid = await validateSlackToken();
    } catch (error) {
      isValid = false;
    }
    runInAction(() => {
      this.isLoading = false;
      this.slackTokenIsValid = isValid;
      this.setSlackTokenIsValidLocalStorage(isValid);
    });
  }

  // HELPERS
  setSlackTokenIsValidLocalStorage(isValid: boolean) {
    window.localStorage.setItem(this.slackTokenIsValidKey, isValid ? 'true' : 'false');
  }
}