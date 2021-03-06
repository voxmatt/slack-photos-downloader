//////////////////////
// IMPORTS
/////////////////////
// libraries
import { WebClient, FilesListArguments } from '@slack/web-api';
// locals
import { SetupDialogStore } from '../stores/setup-dialog-store';

//////////////////////
// TYPES
/////////////////////
export type TAsyncStatus = 'idle' | 'loading' | 'done' | 'error';

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
      && !channel.is_private
      && channel.members.length > 0
      && !channel.is_archived;
  });
}

// instantiate the slackClient as a singleton
const getSlackClient = () => {
  const slackToken = (new SetupDialogStore()).slackToken;
  if (!slackToken) {
    throw new Error('No slack token');
  }
  return new WebClient(slackToken);
}

// pulled this out so the below can optionally fetch from a single or multiple channels
async function baseFetchFiles(passedOptions?: FilesListArguments, getAllPages?: boolean) {
  let pagesToFetch = 1;
  let files: ISlackFile[] = []

  // if getAllPages isn't set, this just iterates once
  for (let page = 1; page <= pagesToFetch; page++) {
    const options = getAllPages ? { ...passedOptions, page } : passedOptions;
    const result = await getSlackClient().files.list(options);

    if (!result.ok) {
      throw new Error('Slack request errored');
    }

    if (!result.files) {
      throw new Error('Slack files not returned');
    }

    if (getAllPages) {
      pagesToFetch = (result.paging as any).pages; // this on the files response
    }

    const fetchedFiles = result.files as ISlackFile[];
    files = [...files, ...fetchedFiles];
  }

  return files;
}

//////////////////////
// API
/////////////////////
export async function validateSlackToken() {
  const result = await getSlackClient().auth.test();
  return result.ok;
}

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

export async function fetchSlackFiles(
  startDate: Date,
  endDate: Date,
  getAllPages?: boolean,
  channels?: string[],
) {
  let files: ISlackFile[] = [];

  let options: FilesListArguments = {
    types: 'images',
    ts_from: `${startDate.valueOf() / 1000}`,
    ts_to: `${endDate.valueOf() / 1000}`,
  };

  // if not passing channel ids, just fetch all of them
  if (!channels || channels.length === 0) {
    files = await baseFetchFiles(options, getAllPages);
    return files;
  }

  // endpoint doesn't allow for multiple channels, so have to iterate
  for (let index = 0; index < channels.length; index++) {
    const channelToFetch = channels[index];
    options.channel = channelToFetch;
    const fetchedFiles = await baseFetchFiles(options, getAllPages);
    files = [...files, ...fetchedFiles];
  }

  return files;
}