//////////////////////
// IMPORTS
/////////////////////
// libraries
import React from 'react';
import { observer } from 'mobx-react'
import { Button, MenuItem, FormGroup } from "@blueprintjs/core";
import { MultiSelect, ItemRenderer } from "@blueprintjs/select";
// component
import './ChannelSelect.css';
import { highlightText, filterChannel } from './ChannelSelectHelpers';
// state
import { useStores } from '../../stores/'
// api
import { ISlackChannel } from '../../api/slack-api';

//////////////////////
// COMPONENT
/////////////////////
// Select<T> is a generic component to work with your data types.
// In TypeScript, you must first obtain a non-generic reference:
const ChannelSuggest = MultiSelect.ofType<ISlackChannel>();
// actual component
export const ChannelSelect = observer(() => {
  const { slackChannelsStore } = useStores();
  const {
    channels,
    clearSelectedChannels,
    selectedChannels,
    removeSelectedChannelByIndex,
    addOrRemoveSelectedChannel,
  } = slackChannelsStore;

  // clear button on the right side of the input
  const clearButton = (selectedChannels.length > 0)
    ? <Button icon="cross" minimal={true} onClick={clearSelectedChannels} />
    : undefined;

  // function to render the menu item for each channel
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
        icon={slackChannelsStore.isSelectedChannel(channel) ? "tick" : "blank"}
        key={channel.id}
        onClick={handleClick}
        text={highlightText(text, query)}
      />
    );
  };

  // render!
  return (
    <FormGroup
      label="Channels"
      helperText="Find photos in selected channels"
      labelFor="suggest-input"
    >
      <ChannelSuggest
        items={channels}
        onItemSelect={addOrRemoveSelectedChannel}
        itemRenderer={renderChannel}
        tagRenderer={(item) => item.name}
        itemPredicate={filterChannel}
        selectedItems={selectedChannels}
        resetOnSelect={true}
        fill={true}
        tagInputProps={{
          onRemove: (_val, index) => {
            removeSelectedChannelByIndex(index);
          },
          rightElement: clearButton
        }}
        popoverProps={{
          popoverClassName: 'channel-suggest-popover',
          minimal: true,
        }}
      />
    </FormGroup>
  );
});