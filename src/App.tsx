import React, { useState } from 'react';
import { WebClient } from '@slack/web-api';
import logo from './logo.svg';
import './App.css';

const CLIENT_ID = '88887328098.404244181942';

function sendMessage(slackClient: WebClient, message: string) {
  (async () => {

    try {
      const result = await slackClient.channels.list();
      console.log(result);
    } catch (error) {
      console.log(error);
    }

  })();
}

function SlackClient({ slackToken }: { slackToken: string }) {
  const web = new WebClient(slackToken);
  return (
    <button onClick={() => sendMessage(web, "hello world")}>Send Message</button>
  )
}

function saveSlackToken(slackToken: string) {
  window.localStorage.setItem('slackToken', slackToken);
}

function getSlackToken() {
  return window.localStorage.getItem('slackToken');
}

function reportWindowLocation() {
  console.log(window.location);
  const params = (new URL(document.location.href)).searchParams;
  const code = params.get('code');
  if (code) {
    maybeGetAccessToken(code);
  }
}

async function maybeGetAccessToken(code: string) {
  const requestURI = `https://slack.com/api/oauth.access?client_id=${CLIENT_ID}&code=${code}`;
  const result = await fetch(requestURI);
  console.log(result);
}

function App() {
  const localStorageSlackToken = getSlackToken();
  const [slackToken, setSlackToken] = useState(localStorageSlackToken || '');
  reportWindowLocation();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <label>Slack Token</label>
        <input value={slackToken} onChange={(e) => setSlackToken(e.target.value)} />
        <button onClick={() => saveSlackToken(slackToken)}>Save Token</button>
        <SlackClient slackToken={slackToken} />
      </header>
    </div>
  );
}

export default App;
