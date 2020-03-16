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
  Button,
} from "@blueprintjs/core";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
// component
import "./FetchedPhotos.scss";
import { FetchedPhotosNonIdeal } from './FetchedPhotosNonIdeal';
import { FetchedPhoto } from '../FetchedPhoto/FetchedPhoto';
// other stuff
import { useStores } from '../../stores/'
import { ISlackFile } from '../../api/slack-api';

const slackAuthToken = 'xoxp-88887328098-89756741844-496299900263-39b59498e0006332895dffd837c78403';
//////////////////////
// COMPONENT
/////////////////////
async function downloadAll(photos: ISlackFile[], slackAuthToken: string) {
  const zip = new JSZip();
  const fetchOptions = {
    headers: {
      'Authorization': `Bearer ${slackAuthToken}`,
      'Access-Control-Allow-Origin': '*',
      "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
    }
  };

  for (let index = 0; index < photos.length; index++) {
    const photo = photos[index];

    if (!photo.url_private) {
      console.log(`could not download photo "${photos[index].name}`);
      return;
    }
    const response = await fetch(photo.url_private, fetchOptions);
    const blob = await response.blob();
    zip.file(photo.name || `slack_photo_${index}`, blob, { binary: true });
  }
  zip.generateAsync({ type: 'blob' }).then((zipContent) => {
    saveAs('slack_downloads.zip');
  });
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
    <Button onClick={() => downloadAll(slackPhotosStore.photos, slackAuthToken)}>Download All</Button>
    <div className="FetchedPhotos_listContainer">
      {slackPhotosStore.photos.map((photo) => <FetchedPhoto key={photo.id} photo={photo} />)}
    </div>
    <FetchedPhotosNonIdeal
      isError={slackPhotosStore.status === 'error'}
      isEmpty={slackPhotosStore.photos.length === 0}
    />
  </Card>);
});
