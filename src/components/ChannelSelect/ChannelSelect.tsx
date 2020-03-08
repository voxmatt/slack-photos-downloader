// libraries
import React from 'react';
import { MenuItem } from "@blueprintjs/core";
import { MultiSelect, ItemRenderer } from "@blueprintjs/select";
// component
import { ISlackChannel } from './ChannelSelect.d';
import './ChannelSelect.css';
import { highlightText, filterFilm } from './ChannelSelectHelpers';

// Select<T> is a generic component to work with your data types.
// In TypeScript, you must first obtain a non-generic reference:
const ChannelSuggest = MultiSelect.ofType<ISlackChannel>();

const renderChannel: ItemRenderer<ISlackChannel> = (channel, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  const text = `${channel.name}`;
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={`${channel.num_members}`}
      key={channel.id}
      onClick={handleClick}
      text={highlightText(text, query)}
    />
  );
};

export function ChannelSelect({ channels, onItemSelect, selectedChannels }: {
  channels: ISlackChannel[],
  selectedChannels: ISlackChannel[],
  onItemSelect: (item: ISlackChannel) => void,
}) {
  return (
    <ChannelSuggest
      items={channels}
      onItemSelect={onItemSelect}
      itemRenderer={renderChannel}
      tagRenderer={(item) => item.name}
      itemPredicate={filterFilm}
      popoverProps={{
        popoverClassName: 'channel-suggest-popover',
        minimal: true,
      }}
    />
  );
} 