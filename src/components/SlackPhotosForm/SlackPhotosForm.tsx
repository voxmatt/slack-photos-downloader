//////////////////////
// IMPORTS
/////////////////////
// libraries
import React, { useEffect } from 'react';
import { observer } from 'mobx-react'
import {
  Button,
  Card,
  Classes,
  H5,
  ProgressBar,
  Elevation,
} from "@blueprintjs/core";
// other components
import { ChannelSelect } from '../ChannelSelect/ChannelSelect';
import { DateRangeSelect } from '../DateRangeSelect/DateRangeSelect';
// other stuff
import { useStores } from '../../stores/'
import { ISlackFile } from '../../api/slack-api';

//////////////////////
// COMPONENT
/////////////////////
const SlackPhotos = ({ photos }: { photos: ISlackFile[] }) => {
  return (<>
    {photos.map((photo) => {
      const file = new Blob([photo.url_private as any], { type: photo.filetype });
      const href = URL.createObjectURL(file);
      return (<a key={photo.id} href={href} download={photo.name}>
        <img alt={photo.name} src={photo.thumb_64} />
      </a>);
    })}
  </>);
}

export const SlackPhotosForm = observer(() => {
  const { slackChannelsStore, slackPhotosStore } = useStores();
  useEffect(() => {
    // note: I'm not handling errors here...
    slackChannelsStore.fetchChannels()
  }, [slackChannelsStore]); // this will only run once due to empty array

  return (<div>
    <Card elevation={Elevation.TWO}>
      <H5>
        Slack Options
      </H5>
      <DateRangeSelect />
      <div className={slackChannelsStore.status === 'done' ? '' : Classes.SKELETON}>
        <ChannelSelect />
      </div>
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
    </Card>
  </div>);
});
