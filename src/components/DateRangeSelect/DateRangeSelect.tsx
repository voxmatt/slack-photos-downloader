//////////////////////
// IMPORTS
/////////////////////
// libraries
import React from 'react';
import { observer } from 'mobx-react'
import { DateRangeInput } from "@blueprintjs/datetime";
// other stuff
import { useStores } from '../../stores'

//////////////////////
// HELPERS
/////////////////////
function dateFormatter(date: Date) {
  const month = date.getMonth() + 1; // stupid zero indexed dates
  return `${month}/${date.getDate()}/${date.getFullYear()}`;
}

//////////////////////
// COMPONENT
/////////////////////
export const DateRangeSelect = observer(() => {
  const { slackPhotosStore } = useStores();
  return (<DateRangeInput
    shortcuts
    allowSingleDayRange
    singleMonthOnly
    formatDate={dateFormatter}
    onChange={slackPhotosStore.setDates}
    parseDate={str => new Date(str)}
    value={[
      slackPhotosStore.startDate,
      slackPhotosStore.endDate,
    ]}
  />)
});
