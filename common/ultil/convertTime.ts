import moment from "moment";

export const convertTime = (time: string): string =>
  moment(time, "hh:mm:ss").format("hh:mm A");
