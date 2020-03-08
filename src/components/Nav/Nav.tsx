//////////////////////
// IMPORTS
/////////////////////
// libraries
import React from 'react';
import { observer } from 'mobx-react'
import {
  Button,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Classes,
} from "@blueprintjs/core";
// this component

// other stuff
import { useStores } from '../../stores/'

//////////////////////
// COMPONENT
/////////////////////
export const Nav = observer(() => {
  const { setupDialogStore } = useStores();

  return (
    <Navbar className={Classes.DARK}>
      <NavbarGroup>
        <NavbarHeading>Slack Photo Exporter</NavbarHeading>
      </NavbarGroup>
      <NavbarGroup align="right">
        <Button
          icon="settings"
          text="Setup"
          onClick={() => setupDialogStore.openDialog()}
        />
      </NavbarGroup>
    </Navbar>
  );
});
