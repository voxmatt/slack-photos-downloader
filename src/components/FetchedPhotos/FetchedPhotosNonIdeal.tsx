//////////////////////
// IMPORTS
/////////////////////
// libraries
import React from 'react';
import { NonIdealState } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

//////////////////////
// COMPONENT
/////////////////////
export const FetchedPhotosNonIdeal = ({ isError, isEmpty }: { isError: boolean; isEmpty: boolean }) => {
  if (isError) {
    return (<NonIdealState
      icon={IconNames.ERROR}
      title="Error"
      description="There was an error when trying to fetch photos from Slack. Please try again."
    />);
  }
  if (isEmpty) {
    return (<NonIdealState
      icon={IconNames.OUTDATED}
      title="No Photos Found"
      description="Please loosen your search options and try again."
    />);
  }
  return (<></>);
}