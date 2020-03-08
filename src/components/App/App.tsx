//////////////////////
// IMPORTS
/////////////////////
// libraries
import React from 'react';
import { observer } from 'mobx-react'
// this component
import './App.scss';
// other components
import { Nav } from '../Nav/Nav';
import { SetupDialog } from '../SetupDialog/SetupDialog';
import { SetupNeededView } from '../SetupNeededView/SetupNeededView';
import { SlackPhotosForm } from '../SlackPhotosForm/SlackPhotosForm';
// other stuff
import { useStores } from '../../stores/'

//////////////////////
// COMPONENT
/////////////////////
export const App = observer(() => {
  const { setupDialogStore } = useStores();
  return (
    <div className="App" style={{ position: 'relative' }}>
      <Nav />
      <div className="App_content">
        {setupDialogStore.slackTokenIsValid ? (
          <SlackPhotosForm />
        ) : (
            <SetupNeededView />
          )}
      </div>
      <SetupDialog />
    </div>
  );
});
