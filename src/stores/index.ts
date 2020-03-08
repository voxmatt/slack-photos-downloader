import React from 'react'
import { SetupDialogStore } from './setup-dialog-store';
import { SlackChannelsStore } from './slack-channels-store';
import { SlackPhotosStore } from './slack-photos-store';
import { LocalStore } from './local-store';

const storesContext = React.createContext({
  setupDialogStore: new SetupDialogStore(),
  slackChannelsStore: new SlackChannelsStore(),
  slackPhotosStore: new SlackPhotosStore(),
  localStore: new LocalStore(),
});

// publish as a hook
export const useStores = () => React.useContext(storesContext)