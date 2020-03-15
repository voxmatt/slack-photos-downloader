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
  H4,
  Elevation,
} from "@blueprintjs/core";
// other components
import { ChannelSelect } from '../ChannelSelect/ChannelSelect';
import { DateRangeSelect } from '../DateRangeSelect/DateRangeSelect';
// other stuff
import { useStores } from '../../stores'

//////////////////////
// COMPONENT
/////////////////////
export const FetchOptions = observer(() => {
  const { slackChannelsStore, slackPhotosStore } = useStores();
  useEffect(() => {
    // note: I'm not handling errors here...
    slackChannelsStore.fetchChannels()
  }, [slackChannelsStore]); // this will only run once due to empty array

  return (<Card elevation={Elevation.TWO}>
    <H4>
      Search Options
    </H4>
    <DateRangeSelect />
    <div className={slackChannelsStore.status === 'done' ? '' : Classes.SKELETON}>
      <ChannelSelect />
    </div>
    <Button
      onClick={() => slackPhotosStore.fetchPhotos(true, slackChannelsStore.selectedChannels.map(sc => sc.id))}
      loading={slackPhotosStore.status === 'loading'}
      intent="success"
      text="Find Photos"
    />
  </Card>);
});
