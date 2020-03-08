//////////////////////
// IMPORTS
/////////////////////
// libraries
import React from 'react';
import { observer } from 'mobx-react'
import {
  Button,
  ProgressBar,
} from "@blueprintjs/core";
// other components
import { ChannelSelect } from '../ChannelSelect/ChannelSelect';
// other stuff
import { useStores } from '../../stores/'
import { ISlackFile } from '../../api/slack-api';

//////////////////////
// COMPONENT
/////////////////////
const SlackPhotos = ({ photos }: { photos: ISlackFile[] }) => {
  return (
    <div>
      {photos.map((photo) => (
        <img key={photo.id} alt={photo.name} src={photo.thumb_360} />
      ))}
    </div>
  );
}

export const SlackPhotosForm = observer(() => {
  const { slackChannelsStore, slackPhotosStore } = useStores();
  return (
    <div>
      <Button
        onClick={() => slackChannelsStore.fetchChannels()}
        intent="success"
        text="Fetch Channels"
      />
      {slackChannelsStore.status === 'done' ? (
        <ChannelSelect />
      ) : <></>}
      <Button
        onClick={() => slackPhotosStore.fetchPhotos(slackChannelsStore.selectedChannels.map(sc => sc.id))}
        intent="success"
        text="Fetch Files"
      />
      {slackPhotosStore.status === 'done' ? (
        <SlackPhotos photos={slackPhotosStore.photos} />
      ) : slackPhotosStore.status === 'pending' ? (
        <ProgressBar />
      ) : (<></>)}
    </div>
  );
});
