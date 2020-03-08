//////////////////////
// IMPORTS
/////////////////////
// libraries
import { observable, action, configure, runInAction } from 'mobx';
import { WebClient } from '@slack/web-api';
// locals
import { LocalStore } from './local-store';
import { ISlackChannel } from '../components/ChannelSelect/ChannelSelect.d';
// config
configure({ enforceActions: "always" });

//////////////////////
// TYPES
/////////////////////
type TSlackChannelsStatus = 'pending' | 'done' | 'error';

//////////////////////
// HELPERS
/////////////////////
function filterChannels(channels: ISlackChannel[]) {
  return channels.filter((channel) => {
    return !!channel.is_channel
      && channel.members.length > 0
      && !channel.is_archived;
  });
}

async function fetchChannelsSomehow() {
  const slackToken = (new LocalStore()).getSlackToken();
  if (!slackToken) {
    throw new Error('No slack token');
  }

  const slackClient = new WebClient(slackToken);
  if (!slackClient) {
    throw new Error('No Slack client');
  }

  const result = await slackClient.channels.list();
  if (!result.ok) {
    throw new Error('Slack request errored');
  }

  if (!result.channels) {
    throw new Error('Channels were not returned');
  }
  return filterChannels(result.channels as ISlackChannel[]);
}

//////////////////////
// STORE
/////////////////////
export class SlackChannelsStore {
  // OBSERVABLES
  @observable
  public status: TSlackChannelsStatus = 'pending';

  @observable
  public channels: ISlackChannel[] = [];

  @observable
  public selectedChannels: ISlackChannel[] = [];

  // ACTIONS
  @action
  addSelectedChannel(channel: ISlackChannel) {
    const isDupe = this.isSelectedChannel(channel);
    if (!isDupe) {
      this.selectedChannels.push(channel);
    }
  }

  // ACTIONS
  @action
  removeSelectedChannel(id: string) {
    const indexToRemove = this.selectedChannels.findIndex(c => c.id === id);
    if (indexToRemove > -1) {
      this.selectedChannels.splice(indexToRemove, 1);
    }
  }

  @action
  async fetchChannels() {
    this.channels = [];
    this.status = 'pending';
    try {
      const channels = await fetchChannelsSomehow();
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
  isSelectedChannel(channel: ISlackChannel) {
    const dupe = this.selectedChannels.find((selectedChannel) => {
      return selectedChannel.id === channel.id;
    });
    return !!dupe;
  }

  sortChannels(channels: ISlackChannel[]) {
    return channels.sort((a, b) => {
      return (b.num_members | 0) - (a.num_members | 0);
    });
  }
}