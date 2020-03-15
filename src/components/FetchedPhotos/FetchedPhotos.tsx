//////////////////////
// IMPORTS
/////////////////////
// libraries
import React from 'react';
import { observer } from 'mobx-react'
import {
  Card,
  NonIdealState,
  H4,
  Elevation,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
// component
import "./FetchedPhotos.scss";
import { FetchedPhoto } from '../FetchedPhoto/FetchedPhoto';
// other stuff
import { useStores } from '../../stores/'

//////////////////////
// COMPONENT
/////////////////////
const MaybeShowNonIdealState = ({ isError, isEmpty }: { isError: boolean; isEmpty: boolean }) => {
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

export const FetchedPhotos = observer(() => {
  const { slackPhotosStore } = useStores();
  if (slackPhotosStore.status === 'idle' || slackPhotosStore.status === 'loading') {
    return (<></>)
  }

  return (<Card className="FetchedPhotos_card" elevation={Elevation.TWO}>
    <H4>
      Results
    </H4>
    <div className="FetchedPhotos_listContainer">
      {slackPhotosStore.photos.map((photo) => <FetchedPhoto key={photo.id} photo={photo} />)}
    </div>
    <MaybeShowNonIdealState
      isError={slackPhotosStore.status === 'error'}
      isEmpty={slackPhotosStore.photos.length === 0}
    />
  </Card>);
});
