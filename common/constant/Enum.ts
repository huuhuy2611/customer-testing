export enum StateReservation {
  CONFIRMED = "CONFIRMED",
  CONFIRM_CANCEL = "CONFIRM_CANCEL",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export enum BlockReason {
  BLOCK = 'Block out date',
  NO_AVAILABLE = 'No available timeslots',
  NO_SETTING = 'No service timing setting'
}

export const DEVICE_TYPE = {
  MOBILE: "mobile",
  PC: "PC",
};

export const STATE_BOOKING = {
  BOOKED: "1",
  COMPLETE: "2",
  CANCEL: "4",
  EXPIRED: "5",
  CONFIRM: "6",
};


