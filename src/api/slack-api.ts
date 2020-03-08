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

export interface ISlackFile {
  id: string;
  created?: number;
  timestamp?: number;
  name?: string;
  title?: string;
  mimetype?: string;
  filetype?: string;
  pretty_type?: string;
  user?: string;
  editable?: boolean;
  size?: number;
  mode?: string;
  is_external?: boolean;
  external_type?: string;
  is_public?: boolean;
  public_url_shared?: boolean;
  display_as_bot?: boolean;
  username?: string;
  url_private?: string;
  url_private_download?: string;
  thumb_64?: string;
  thumb_80?: string;
  thumb_360?: string;
  thumb_360_w?: number;
  thumb_360_h?: number;
  thumb_160?: string;
  thumb_360_gif?: string;
  image_exif_rotation?: 1,
  original_w?: number;
  original_h?: number;
  deanimate_gif?: string;
  pjpeg?: string;
  permalink?: string;
  permalink_public?: string;
  channels?: string[];
  groups?: string[];
  ims?: string[];
  comments_count?: number;
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

// instantiate the slackClient as a singleton
let SlackClient: WebClient;
const getSlackClient = () => {
  const slackToken = (new LocalStore()).getSlackToken();
  if (!slackToken) {
    throw new Error('No slack token');
  }
  if (!SlackClient) {
    SlackClient = new WebClient(slackToken);
  }
  return SlackClient;
}

//////////////////////
// API
/////////////////////
export async function fetchSlackChannels() {
  const result = await getSlackClient().channels.list();
  if (!result.ok) {
    throw new Error('Slack request errored');
  }

  if (!result.channels) {
    throw new Error('Channels were not returned');
  }
  return filterChannels(result.channels as ISlackChannel[]);
}

export async function fetchSlackFiles() {
  // const now = Date.now();
  // const millisInAWeek = 604800000;
  const result = await getSlackClient().files.list({
    types: 'images',
  });

  if (!result.ok) {
    throw new Error('Slack request errored');
  }

  if (!result.files) {
    throw new Error('Slack files not returned');
  }

  return result.files as ISlackFile[];
}