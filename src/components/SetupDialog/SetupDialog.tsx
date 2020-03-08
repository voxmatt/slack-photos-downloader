//////////////////////
// IMPORTS
/////////////////////
// libraries
import React from 'react';
import { observer } from 'mobx-react'
import {
  Dialog,
  Classes,
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
      onClose={() => setupDialogStore.close()}
      title="Setup"
      isOpen={setupDialogStore.isOpen}
    >
      <div className={Classes.DIALOG_BODY}>
        Hello?
      </div>
    </Dialog>
  );
});
