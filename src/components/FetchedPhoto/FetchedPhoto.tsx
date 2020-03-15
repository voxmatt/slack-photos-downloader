//////////////////////
// IMPORTS
/////////////////////
// libraries
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Menu, MenuItem } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
// component
import "./FetchedPhoto.scss";
// other stuff
import { ISlackFile } from '../../api/slack-api';
import { useStores } from '../../stores/';

//////////////////////
// COMPONENT
/////////////////////
export const FetchedPhoto = observer(({ photo }: { photo: ISlackFile }) => {
  const { slackPhotosStore } = useStores();
  // in thumbnail mode by default
  const [isThumbnail, setIsThumbnail] = useState(true);

  // is there a better way to construct these?
  const containerClassName = `FetchedPhoto_container ${isThumbnail ? 'thumbnail' : ''}`

  return (<div className={containerClassName}>
    <img
      alt={photo.name}
      src={isThumbnail ? photo.thumb_160 : photo.url_private}
    />
    <div className="controls" >
      <Menu>
        <MenuItem
          icon={isThumbnail ? IconNames.MAXIMIZE : IconNames.MINIMIZE}
          onClick={() => setIsThumbnail(!isThumbnail)}
        />
        <MenuItem icon={IconNames.DELETE} onClick={() => slackPhotosStore.removePhoto(photo.id)} />
        <MenuItem icon={IconNames.DOWNLOAD} href={photo.url_private_download} />
      </Menu>
    </div>
  </div>)
})