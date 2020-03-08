export class LocalStore {
  private slackTokenKey = 'slackToken';

  public saveSlackToken(slackToken: string) {
    window.localStorage.setItem(this.slackTokenKey, slackToken);
  }

  public getSlackToken() {
    return window.localStorage.getItem(this.slackTokenKey);
  }
}