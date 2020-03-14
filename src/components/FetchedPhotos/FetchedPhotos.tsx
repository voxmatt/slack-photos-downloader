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
// other stuff
import { useStores } from '../../stores/'
import { ISlackFile } from '../../api/slack-api';

//////////////////////
// COMPONENT
/////////////////////
const Photo = ({ photo }: { photo: ISlackFile }) => {
  return (<Card style={{ padding: 0, display: 'inline', margin: 5 }} interactive>
    <img alt={photo.name} src={photo.thumb_64} />
  </Card>)
}

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
    {slackPhotosStore.photos.map((photo) => <Photo key={photo.id} photo={photo} />)}
    <MaybeShowNonIdealState
      isError={slackPhotosStore.status === 'error'}
      isEmpty={slackPhotosStore.photos.length === 0}
    />
  </Card>);
});
