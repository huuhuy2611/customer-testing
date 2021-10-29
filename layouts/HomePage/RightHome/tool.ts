import moment from "moment";
import { IAvailableServiceTiming } from "@/common/interface";
import { convertTime } from "@/common/ultil/convertTime";
import { TimeProp } from "@/store/store";

export const renderListOption = (
  res: IAvailableServiceTiming[],
  date: string
): TimeProp[] => {
  const currentTime = moment();
  let tempArr: { value: string; id: string }[] = [];
  let result: TimeProp[] = [];
  res.forEach(e => {
    if (e.availableTimeSlots.length > 0)
      tempArr = tempArr.concat(
        e.availableTimeSlots.map(i => ({
          value: i,
          id: e?.id,
        }))
      );
  });

  tempArr = tempArr.sort((a, b) => {
    // sort asc
    const time1 = moment(a.value, "hh:mm:ss");
    const time2 = moment(b.value, "hh:mm:ss");
    return time1.diff(time2);
  });

  if (date && currentTime.diff(moment(date, "YYYY-MM-DD")) > 0) {
    result = tempArr
      .filter(e => currentTime.diff(moment(e.value, "hh:mm:ss")) < 0)
      .map((e: { value: string; id: string }) => ({
        ...e,
        label: convertTime(e.value),
      }));
  } else {
    result = tempArr.map((e: { value: string; id: string }) => ({
      ...e,
      label: convertTime(e.value),
    }));
  }

  return result;
};

export const dayOfWeek = (dateInput: string): string => {
  let result: string;
  const yesterday = moment().add(-1, "days").format("dddd, DD MMM");
  const today = moment().format("dddd, DD MMM");
  const tomorrow = moment().add(1, "days").format("dddd, DD MMM");
  const dateFormated = moment(dateInput).format("dddd, DD MMM");
  switch (dateFormated) {
    case yesterday:
      result = `Yesterday, ${moment(dateInput).format("DD MMM")}`;
      break;

    case today:
      result = `Today, ${moment(dateInput).format("DD MMM")}`;
      break;
    case tomorrow:
      result = `Tomorrow, ${moment(dateInput).format("DD MMM")}`;
      break;

    default:
      result = dateFormated;
      break;
  }
  return result;
};

export const dayOfWeekOtherTimslot = (dateInput: string): string => {
  let result: string;
  const today = moment().format("dddd, DD MMM");
  const dateFormated = moment(dateInput).format("dddd, DD MMM");
  switch (dateFormated) {
    case today:
      result = `today`;
      break;
    default:
      result = `on ${dateFormated}`;
      break;
  }
  return result;
};

export const generateListTimeAroundPreferredTime = (
  preferredTime: string,
  listTimeAvailable: TimeProp[]
): { timeSlotGenerated: TimeProp; list5Time: TimeProp[] } => {
  const startTime = moment(preferredTime, "HH:mm:ss").add(-2.5, "hours");
  const endTime = moment(preferredTime, "HH:mm:ss").add(2.5, "hours");
  const listTimeAroundPreferredTime = listTimeAvailable?.filter(time => {
    const distance = [
      endTime.diff(moment(time.value, "HH:mm:ss")),
      startTime.diff(moment(time.value, "HH:mm:ss")),
    ];
    return distance[0] > 0 && distance[1] < 0;
  });

  const listAfter =
    listTimeAroundPreferredTime?.filter(
      time =>
        moment(time.value, "HH:mm:ss").diff(
          moment(preferredTime, "HH:mm:ss")
        ) >= 0
    ) || [];
  const listBefore =
    listTimeAroundPreferredTime?.filter(
      time =>
        moment(time.value, "HH:mm:ss").diff(moment(preferredTime, "HH:mm:ss")) <
        0
    ) || [];

  const list5Time = listBefore?.slice(-2).concat(listAfter.slice(0, 3));

  return { timeSlotGenerated: listAfter[0], list5Time };
};

// day of the week
export const dateAfterNDays = (n: number, date: string): string =>
  moment(date).add(n, "days").format("YYYY-MM-DD");
