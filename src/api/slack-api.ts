//////////////////////
// IMPORTS
/////////////////////
// libraries
import { WebClient } from '@slack/web-api';
// locals
import { LocalStore } from '../stores/local-store';

//////////////////////
// TYPES
/////////////////////
export interface ISlackChannel {
  id: string;
  name: string;
  is_channel: boolean;
  created: number;
  is_archived: boolean;
  is_general: boolean;
  unlinked: number;
  creator: string;
  name_normalized: string;
  is_shared: boolean;
  is_org_shared: boolean;
  is_member: boolean;
  is_private: boolean;
  is_mpim: boolean;
  members: string[];
  topic: {
    value: string;
    creator: string;
    last_set: number;
  };
  purpose: {
    value: string;
    creator: string;
    last_set: number;
  };
  previous_names: string[];
  num_members: number;
}

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

//////////////////////
// API
/////////////////////
export async function fetchSlackChannels() {
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