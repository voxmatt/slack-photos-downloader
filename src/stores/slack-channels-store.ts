//////////////////////
// IMPORTS
/////////////////////
// libraries
import { observable, action, configure, runInAction } from 'mobx';
import { fetchSlackChannels, ISlackChannel, TAsyncStatus } from '../api/slack-api';
// config
configure({ enforceActions: "always" });

//////////////////////
// STORE
/////////////////////
export class SlackChannelsStore {
  // OBSERVABLES
  @observable
  public status: TAsyncStatus = 'idle';

  @observable
  public channels: ISlackChannel[] = [];

  @observable
  public selectedChannels: ISlackChannel[] = [];

  // ACTIONS
  @action
  addSelectedChannel = (channel: ISlackChannel) => {
    const isDupe = this.isSelectedChannel(channel);
    if (!isDupe) {
      this.selectedChannels.push(channel);
    }
  }

  // ACTIONS
  @action
  removeSelectedChannel = (id: string) => {
    const indexToRemove = this.selectedChannels.findIndex(c => c.id === id);
    this.removeSelectedChannelByIndex(indexToRemove);
  }

  @action
  removeSelectedChannelByIndex = (index: number) => {
    if (index > -1) {
      this.selectedChannels.splice(index, 1);
    }
  }

  @action
  addOrRemoveSelectedChannel = (channel: ISlackChannel) => {
    const isSelected = this.isSelectedChannel(channel);
    if (isSelected) {
      this.removeSelectedChannel(channel.id);
    } else {
      this.addSelectedChannel(channel);
    }
  }

  @action
  clearSelectedChannels = () => {
    this.selectedChannels = [];
  }

  @action
  async fetchChannels() {
    this.channels = [];
    this.status = 'loading';
    try {
      const channels = await fetchSlackChannels();
      // after await, modifying state again, needs an actions:
      runInAction(() => {
        this.status = "done";
        console.log(channels);
        this.channels = this.sortChannels(channels);
      });
    } catch (error) {
      console.error(error);
      runInAction(() => {
        this.status = "error"
      });
    }
  }

  // CLASS HELPERS
  isSelectedChannel = (channel: ISlackChannel) => {
    const dupe = this.selectedChannels.find((selectedChannel) => {
      return selectedChannel.id === channel.id;
    });
    return !!dupe;
  }

  sortChannels = (channels: ISlackChannel[]) => {
    return channels.sort((a, b) => {
      return (b.num_members | 0) - (a.num_members | 0);
    });
  }
}