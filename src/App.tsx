import React, { useState } from 'react';
import { WebClient } from '@slack/web-api';
import logo from './logo.svg';
import './App.css';

function sendMessage(slackClient: WebClient, message: string) {
  (async () => {

    try {
      // Use the `chat.postMessage` method to send a message from this app
      await slackClient.chat.postMessage({
        channel: '#test-channel',
        text: message,
      });
    } catch (error) {
      console.log(error);
    }

    console.log('Message posted!');
  })();
}

function SlackClient({ slackToken }: { slackToken: string }) {
  const web = new WebClient(slackToken);
  return (
    <button onClick={() => sendMessage(web, "hello world")}>Send Message</button>
  )
}

function App() {
  const [slackToken, setSlackToken] = useState('');
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <label>Slack Token</label>
        <input value={slackToken} onChange={(e) => setSlackToken(e.target.value)} />
        <SlackClient slackToken={slackToken} />
      </header>
    </div>
  );
}

export default App;
