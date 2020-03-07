import React, { useState } from 'react';
import { WebClient } from '@slack/web-api';
import './App.css';
import { Button, FormGroup, InputGroup, ControlGroup } from "@blueprintjs/core";
import { ChannelSelect } from '../ChannelSelect/ChannelSelect';
import { ISlackChannel } from '../ChannelSelect/ChannelSelect.d';
import { relative } from 'path';

type SetChannels = (channels: ISlackChannel[]) => void;

function getChannnels(
  slackClient: WebClient,
  setChannels: SetChannels,
) {
  (async () => {

    try {
      const result = await slackClient.channels.list();
      if (result.ok) {
        const channels = result.channels as ISlackChannel[];
        setChannels(channels);
      }
    } catch (error) {
      console.log(error);
    }

  })();
}

function SlackClient({ slackToken, setChannels }: { slackToken: string; setChannels: SetChannels; }) {
  const web = new WebClient(slackToken);
  return (
    <Button onClick={() => getChannnels(web, setChannels)} intent="success" text="button content" />
  )
}

function saveSlackToken(slackToken: string) {
  window.localStorage.setItem('slackToken', slackToken);
}

function getSlackToken() {
  return window.localStorage.getItem('slackToken');
}

export function App() {
  const localStorageSlackToken = getSlackToken();
  const [slackToken, setSlackToken] = useState(localStorageSlackToken || '');
  const [channels, setChannels] = useState<undefined | ISlackChannel[]>(undefined);
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
            <Button onClick={() => saveSlackToken(slackToken)}>
              Save
            </Button>
          </ControlGroup>
        </FormGroup>
        <SlackClient slackToken={slackToken} setChannels={setChannels} />
        {!!channels ? (
          <ChannelSelect channels={channels} onItemSelect={() => ''} />
        ) : <></>}
      </header>
    </div>
  );
}