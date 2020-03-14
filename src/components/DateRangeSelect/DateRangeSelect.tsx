//////////////////////
// IMPORTS
/////////////////////
// libraries
import React from 'react';
import { observer } from 'mobx-react'
import { FormGroup } from '@blueprintjs/core';
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
  return (<FormGroup
    label="Date Range"
    labelFor="text-input"
    labelInfo="(required)"
    helperText="Search for photos uploaded within this date range"
  >
    <DateRangeInput
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
    />
  </FormGroup>)
});
