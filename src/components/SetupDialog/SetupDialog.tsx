//////////////////////
// IMPORTS
/////////////////////
// libraries
import React from 'react';
import { observer } from 'mobx-react'
import {
  Dialog,
  Classes,
  FormGroup,
  InputGroup,
} from "@blueprintjs/core";
// this component

// other stuff
import { useStores } from '../../stores/'

//////////////////////
// COMPONENT
/////////////////////
export const SetupDialog = observer(() => {
  const { setupDialogStore } = useStores();
  return (
    <Dialog
      icon="settings"
      onClose={() => setupDialogStore.closeDialog()}
      title="Setup"
      isOpen={setupDialogStore.isOpen}
    >
      <div className={Classes.DIALOG_BODY}>
        <FormGroup
          helperText="Ask someone on your developer team how to find this "
          label="Slack Token"
          labelFor="slack-token-input"
          labelInfo="(required)"
        >
          <InputGroup
            id="slack-token-input"
            placeholder="Slack Token"
            value={setupDialogStore.slackToken}
            onChange={(e: any) => setupDialogStore.setSlackToken(e.target.value)}
          />
        </FormGroup>
      </div>
    </Dialog>
  );
});
