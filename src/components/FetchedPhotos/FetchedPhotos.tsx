//////////////////////
// IMPORTS
/////////////////////
// libraries
import React from 'react';
import { observer } from 'mobx-react'
import {
  Card,
  H4,
  Elevation,
} from "@blueprintjs/core";
// component
import "./FetchedPhotos.scss";
import { FetchedPhotosNonIdeal } from './FetchedPhotosNonIdeal';
import { FetchedPhoto } from '../FetchedPhoto/FetchedPhoto';
// other stuff
import { useStores } from '../../stores/'

//////////////////////
// COMPONENT
/////////////////////
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
    <FetchedPhotosNonIdeal
      isError={slackPhotosStore.status === 'error'}
      isEmpty={slackPhotosStore.photos.length === 0}
    />
  </Card>);
});
