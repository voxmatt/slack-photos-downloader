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

  let namesRecord: { [key: string]: number } = {};

  for (let index = 0; index < photos.length; index++) {
    const photo = photos[index];

    if (!photo.url_private) {
      console.log(`could not download photo "${photos[index].name}`);
      return;
    }
    const proxyUrl = 'http://localhost:3121/';
    const response = await fetch(proxyUrl + photo.url_private, fetchOptions);
    const blob = await response.blob();

    // these can have dupe names and then jsZip overwrites
    let photoName = photo.name || `image.${photo.filetype}`;
    const nameCount = namesRecord[photoName] || 0;
    namesRecord[photoName] = nameCount + 1;

    if (nameCount > 0) {
      const nameParts = photoName.split('.');
      nameParts.splice(nameParts.length - 1, 0, `${nameCount}`);
      photoName = nameParts.join('.');
    }
    const date = photo.created ? new Date(photo.created * 1000) : new Date();
    zip.file(photoName as string, blob, { binary: true, date });
  }
  zip.generateAsync({ type: 'blob' }).then((zipContent) => {
    saveAs(zipContent, 'slack_downloads.zip');
  });
}

export const FetchedPhotos = observer(() => {
  const { slackPhotosStore, setupDialogStore } = useStores();
  const { slackToken } = setupDialogStore;
  if (slackPhotosStore.status === 'idle' || slackPhotosStore.status === 'loading' || !slackToken) {
    return (<></>)
  }

  return (<Card className="FetchedPhotos_card" elevation={Elevation.TWO}>
    <H4>
      Results
    </H4>
    <Button onClick={() => downloadAll(slackPhotosStore.photos, slackToken)}>Download All</Button>
    <div className="FetchedPhotos_listContainer">
      {slackPhotosStore.photos.map((photo) => <FetchedPhoto key={photo.id} photo={photo} />)}
    </div>
    <FetchedPhotosNonIdeal
      isError={slackPhotosStore.status === 'error'}
      isEmpty={slackPhotosStore.photos.length === 0}
    />
  </Card>);
});
