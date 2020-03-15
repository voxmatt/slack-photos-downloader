//////////////////////
// IMPORTS
/////////////////////
// libraries
import React, { useState } from 'react';
import { Menu, MenuItem } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
// component
import "./FetchedPhoto.scss";
// other stuff
import { ISlackFile } from '../../api/slack-api';

//////////////////////
// COMPONENT
/////////////////////
export const FetchedPhoto = ({ photo }: { photo: ISlackFile }) => {
  const [expanded, setExpanded] = useState(false);

  const containerClassName = expanded
    ? 'FetchedPhoto_container expanded'
    : 'FetchedPhoto_container thumbnail'

  return (<div className={containerClassName}>
    <img width={expanded ? `100%` : `110%`}
      alt={photo.name}
      src={expanded ? photo.url_private : photo.thumb_160}
    />
    <div className="controls" >
      <Menu>
        <MenuItem
          icon={expanded ? IconNames.MINIMIZE : IconNames.MAXIMIZE}
          onClick={() => setExpanded(!expanded)}
        />
        <MenuItem icon={IconNames.DELETE} />
        <MenuItem icon={IconNames.DOWNLOAD} />
      </Menu>
    </div>
  </div>)
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
