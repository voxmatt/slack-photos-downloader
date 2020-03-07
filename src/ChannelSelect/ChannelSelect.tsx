import React from 'react';
import { MenuItem } from "@blueprintjs/core";
import { Suggest, ItemRenderer, ItemPredicate } from "@blueprintjs/select";
import { ISlackChannel } from './ChannelSelect.d';
import './ChannelSelect';

// Select<T> is a generic component to work with your data types.
// In TypeScript, you must first obtain a non-generic reference:
const ChannelSuggest = Suggest.ofType<ISlackChannel>();

function escapeRegExpChars(text: string) {
  return text.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
}

function highlightText(text: string, query: string) {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join("|"), "gi");
  const tokens: React.ReactNode[] = [];
  while (true) {
    const match = regexp.exec(text);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
}

const filterFilm: ItemPredicate<ISlackChannel> = (query, slackChannel, _index, exactMatch) => {
  const normalizedTitle = slackChannel.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return `${slackChannel.name}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
  }
};


const renderChannel: ItemRenderer<ISlackChannel> = (channel, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  const text = `${channel.name}`;
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={channel.name}
      key={channel.id}
      onClick={handleClick}
      text={highlightText(text, query)}
    />
  );
};

export function ChannelSelect({ channels, onItemSelect }: {
  channels: ISlackChannel[],
  onItemSelect: (item: ISlackChannel) => void,
}) {
  return (
    <ChannelSuggest
      items={channels}
      onItemSelect={onItemSelect}
      itemRenderer={renderChannel}
      inputValueRenderer={(item) => item.name}
      itemPredicate={filterFilm}
      popoverProps={{
        popoverClassName: 'channel-suggest-popover',
      }}
    />
  );
} 