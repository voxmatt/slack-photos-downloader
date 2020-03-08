//////////////////////
// IMPORTS
/////////////////////
// libraries
import React from 'react';
import { observer } from 'mobx-react'
import {
  Button,
  Card,
  Elevation,
  NonIdealState,
} from "@blueprintjs/core";
// other stuff
import { useStores } from '../../stores/'

//////////////////////
// COMPONENT
/////////////////////
export const SetupNeededView = observer(() => {
  const { setupDialogStore } = useStores();
  return (<Card elevation={Elevation.TWO}>
    <NonIdealState
      icon="settings"
      title="Setup Required"
      description="Please open the setup dialog to get started."
      action={
        <Button
          large
          intent="primary"
          onClick={() => setupDialogStore.openDialog()}
        >
          Open Setup Dialog
        </Button>
      }
    />
  </Card>
  );
});
