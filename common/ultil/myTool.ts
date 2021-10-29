import { useMediaQuery } from "@material-ui/core";
import { differenceInMinutes, format, addMinutes, set } from "date-fns";
import {
  DISTANCE_TIME,
  END_TIME_DROPDOWN_TIMESLOT,
  START_TIME_DROPDOWN_TIMESLOT,
} from "../constant";

export const breakpointUp = (minWidth: number): boolean =>
  useMediaQuery(`(min-width:${minWidth}px)`);

export interface IListTimeSlot {
  label: string;
  value: string;
}

export const generateListTime = (): Array<IListTimeSlot> => {
  const listTime: Array<{ label: string; value: string }> = [];
  let startTime = set(new Date(), START_TIME_DROPDOWN_TIMESLOT);
  const endTime = set(new Date(), END_TIME_DROPDOWN_TIMESLOT);
  while (differenceInMinutes(endTime, startTime) >= 0) {
    listTime.push({
      label: format(startTime, "hh:mma"),
      value: format(startTime, "HH:mm:ss"),
    });
    startTime = addMinutes(startTime, DISTANCE_TIME);
  }
  return listTime;
};
