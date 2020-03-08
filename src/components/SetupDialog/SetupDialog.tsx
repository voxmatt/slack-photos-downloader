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
  TextArea,
  Intent,
  Button,
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
          <TextArea
            fill
            id="slack-token-input"
            placeholder="Slack Token"
            growVertically={true}
            intent={setupDialogStore.slackTokenIsValid
              ? Intent.PRIMARY
              : Intent.DANGER
            }
            value={setupDialogStore.slackToken}
            onChange={(e: any) => setupDialogStore.setSlackToken(e.target.value)}
          />
        </FormGroup>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            intent={Intent.SUCCESS}
            onClick={() => setupDialogStore.closeDialog()}
            loading={setupDialogStore.isLoading}
          >
            Done
          </Button>
        </div>
      </div>
    </Dialog>
  );
});
