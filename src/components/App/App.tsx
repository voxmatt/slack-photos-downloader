//////////////////////
// IMPORTS
/////////////////////
// libraries
import React, { useState } from 'react';
import { observer } from 'mobx-react'
import {
  Button,
  FormGroup,
  InputGroup,
  ControlGroup,
  Card,
  Elevation,
} from "@blueprintjs/core";
// this component
import './App.css';
// other components
import { ChannelSelect } from '../ChannelSelect/ChannelSelect';
// other stuff
import { useStores } from '../../stores/'

//////////////////////
// COMPONENT
/////////////////////
export const App = observer(() => {
  const { localStore, slackChannelsStore } = useStores();
  const localStorageSlackToken = localStore.getSlackToken();
  const [slackToken, setSlackToken] = useState(localStorageSlackToken || '');
  return (
    <div className="App" style={{ position: 'relative', maxHeight: 500 }}>
      <header className="App-header">
        <FormGroup
          helperText="Ask someone on your developer team how to find this "
          label="Slack Token"
          labelFor="slack-token-input"
          labelInfo="(required)"
        >
          <ControlGroup fill={true} vertical={false}>
            <InputGroup
              id="slack-token-input"
              placeholder="Slack Token"
              value={slackToken}
              onChange={(e: any) => setSlackToken(e.target.value)}
            />
            <Button onClick={() => localStore.saveSlackToken(slackToken)}>
              Save
            </Button>
          </ControlGroup>
        </FormGroup>
        <Button
          onClick={() => slackChannelsStore.fetchChannels()}
          intent="success"
          text="Fetch Channels"
        />
        {slackChannelsStore.status === 'done' ? (
          <ChannelSelect />
        ) : <></>}
      </header>
    </div>
  );
});
