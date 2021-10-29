import { convertTime } from "./convertTime";
import { IAvailableServiceTiming } from "../interface";

export interface ListTimeProp {
  label: string;
  id: string;
  options: Array<{
    label: string;
    id: string;
    value: string;
  }>;
  blockedReason: string | null;
}

export const convertListTime = (
  res: Array<IAvailableServiceTiming>,
): ListTimeProp[] => {
  const dataSelect: Array<ListTimeProp> = [];
  res.forEach((item: IAvailableServiceTiming) => {
    const tempData = {
      label: item?.name,
      id: item?.id,
      options:
        item?.availableTimeSlots.map((time) => ({
          label: convertTime(time),
          id: item?.id,
          value: time
        })) || [],
      blockedReason: item?.blockedReason
    };
    dataSelect.push(tempData);
  });

  return dataSelect;
};