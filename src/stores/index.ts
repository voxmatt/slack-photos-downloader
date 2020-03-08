import React from 'react'
import { SlackChannelsStore } from './slack-channels-store';
import { LocalStore } from './local-store';

const storesContext = React.createContext({
  slackChannelsStore: new SlackChannelsStore(),
  localStore: new LocalStore(),
});

// publish as a hook
export const useStores = () => React.useContext(storesContext)