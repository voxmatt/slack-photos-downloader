import React, { useState } from 'react';
import { WebClient } from '@slack/web-api';
import './App.css';
import { Button, FormGroup, InputGroup, ControlGroup, Card, Elevation } from "@blueprintjs/core";
import { ChannelSelect } from '../ChannelSelect/ChannelSelect';
import { ISlackChannel } from '../ChannelSelect/ChannelSelect.d';

import { observer } from 'mobx-react'
import { useStores } from '../../stores/'

type SetChannels = (channels: ISlackChannel[]) => void;

function getChannnels(
  slackClient: WebClient,
  setChannels: SetChannels,
) {
  (async () => {

    try {
      const result = await slackClient.channels.list();
      if (result.ok) {
        const channels = (result.channels as ISlackChannel[]).filter((channel) => {
          return !!channel.is_channel
            && channel.members.length > 0
            && !channel.is_archived;
        });
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

// src/components/Counter.tsx
export const Counter = observer(() => {
  const { slackChannelsStore } = useStores()

  return (
    <>
      <div>{slackChannelsStore.count}</div>
      <button onClick={() => slackChannelsStore.increment()}>++</button>
      <button onClick={() => slackChannelsStore.decrement()}>--</button>
    </>
  )
})

export const App = observer(() => {
  const localStorageSlackToken = getSlackToken();
  const [slackToken, setSlackToken] = useState(localStorageSlackToken || '');
  const [channels, setChannels] = useState<undefined | ISlackChannel[]>(undefined);
  const [selectedChannels, selectChannels] = useState<ISlackChannel[]>([]);
  const onItemSelect = (channel: ISlackChannel) => {
    selectChannels([channel]);
  }
  return (
    <div className="App" style={{ position: 'relative', maxHeight: 500 }}>
      <header className="App-header">
        <FormGroup
          helperText="Ask someone on your developer team how to find this "
          label="Slack Token"
          labelFor="slack-token-input"
          labelInfo="(required)"
        >
          <Counter />
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
          <ChannelSelect selectedChannels={selectedChannels} channels={channels} onItemSelect={onItemSelect} />
        ) : <></>}
        {selectedChannels.length > 0 ? (
          <Card interactive={true} elevation={Elevation.TWO}>
            <p>
              {selectedChannels.toString()}
            </p>
          </Card>
        ) : (<></>)}
      </header>
    </div>
  );
});
