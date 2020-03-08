//////////////////////
// IMPORTS
/////////////////////
// libraries
import React from 'react';
import { observer } from 'mobx-react'
import {
  Classes,
} from "@blueprintjs/core";
import { DateRangePicker } from "@blueprintjs/datetime";
// other stuff
import { useStores } from '../../stores/'

//////////////////////
// COMPONENT
/////////////////////
export const DateRangeSelect = observer(() => {
  const { slackPhotosStore } = useStores();

  return (<DateRangePicker
    allowSingleDayRange
    singleMonthOnly
    shortcuts
    className={Classes.ELEVATION_1}
    maxDate={new Date()}
    onChange={console.log}
  />);
});
