import React from 'react'
import { SlackChannelsStore } from './slack-channels-store';

const storesContext = React.createContext({
  slackChannelsStore: new SlackChannelsStore(),
});

// publish as a hook
export const useStores = () => React.useContext(storesContext)