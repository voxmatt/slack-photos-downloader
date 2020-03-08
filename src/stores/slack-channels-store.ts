import { observable, action, computed } from 'mobx';

export class SlackChannelsStore {
  @observable
  count = 0;

  @action
  increment() {
    this.count++;
  }

  @action
  decrement() {
    this.count--;
  }

  @computed
  get doubleCount() {
    return this.count * 2;
  }
}