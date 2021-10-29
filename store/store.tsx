import create, {SetState} from "zustand";
import {devtools} from "zustand/middleware";
import moment from "moment";
import { IOccasionResponse } from "@/common/interface";

export type GuestDataProp = {
  phone: boolean;
  firstName: boolean;
  lastName: boolean;
}

export type BookingStoreProp = {
  outlet: OutletProp;
  date: string;
  time: TimeProp;
  numAdults: number;
  numChild: number;
  setOutlet: (newOutlet: OutletProp) => void;
  setDate: (newDate: string) => void;
  setTime: (newTime: TimeProp) => void;
  setNumAdults: (newNumAdults: number) => void;
  setNumChild: (newNumChild: number) => void;
};

export type TimeProp = {
  value?: string;
  label?: string;
  id?: string;
};

export type OutletProp = {
  outlet: string;
  address: string;
  id: string;
  maxPax: number;
  logo: string;
  email: string;
  phone: string;
  operationHours: string;
  reservationDiningInterval: number;
  reservationPolicy: string;
  directionLink: string;
};

export type AuthProp = {
  user: UserProp;
  setUser: (newUser: UserProp) => void;
};

export type UserProp = {
  name?: string;
  phone: string;
  email: string;
  firstname: string;
  lastname: string;
  token?: string;
  countryCode?: string;
};
export type UseBrandProp = {
  brand: BrandProp;
  setBrand: (newBrand: BrandProp) => void;
};

export type BrandProp = {
  name: string;
  logo: string;
  cover: string;
  shortName: string;
  id: string;
  occasions: Array<IOccasionResponse>;
  countryCode: string;
};

export interface IDataBooking {
  reservationTime: string;
  reservationDate: string;
  outletId: string;
  serviceTimingId: string;
}

export interface ValidateGuestDataProp {
  data: GuestDataProp;
  setData : (newData : GuestDataProp) => void
}

export interface IDataBookingStore {
  dataBooking: IDataBooking;
  setDataBooking: (dataBooking: IDataBooking) => void;
}

const validateGuestData = (set: SetState<ValidateGuestDataProp>) => ({
  data: {
    phone: false,
    lastName: false,
    firstName: false,
  },
  setData : (newData : GuestDataProp) => set(state => ({...state, data : newData}))
})

const bookingStore = (set: SetState<BookingStoreProp>) => ({
  outlet: {
    outlet: "",
    address: "",
    id: "",
    maxPax: 0,
    logo: "",
    email: "",
    phone: "",
    operationHours: "",
    reservationDiningInterval: 0,
    reservationPolicy: "",
    directionLink: "",
  },
  date: moment().format("YYYY-MM-DD"),
  time: {
    value: "",
    label: "",
    id: "",
  },
  numAdults: 2,
  numChild: 0,
  setOutlet: (newOutlet: OutletProp) =>
    set(state => ({...state, outlet: newOutlet})),
  setDate: (newDate: string) => set(state => ({...state, date: newDate})),
  setTime: (newTime: TimeProp) => set(state => ({...state, time: newTime})),
  setNumAdults: (newNumAdults: number) =>
    set(state => ({...state, numAdults: newNumAdults})),
  setNumChild: (newNumChild: number) =>
    set(state => ({...state, numChild: newNumChild})),
});

const authStore = (set: SetState<AuthProp>) => ({
  user: {
    name: "",
    phone: "",
    email: "",
    firstname: "",
    lastname: "",
    token: "",
  },
  setUser: (newUser: UserProp) => set(state => ({...state, user: newUser})),
});

const authGuestStore = (set: SetState<AuthProp>) => ({
  user: {
    phone: "",
    email: "",
    firstname: "",
    lastname: "",
  },
  setUser: (newUser: UserProp) => set(state => ({...state, user: newUser})),
});

const brandStore = (set: SetState<UseBrandProp>) => ({
  brand: {
    name: "",
    logo: "",
    cover: "",
    shortName: "",
    id: "",
    occasions: [],
    countryCode: "",
  },
  setBrand: (newBrand: BrandProp) =>
    set(state => ({...state, brand: newBrand})),
});

const dataBookingStore = (set: SetState<IDataBookingStore>) => ({
  dataBooking: {
    reservationTime: "",
    reservationDate: "",
    outletId: "",
    serviceTimingId: "",
  },
  setDataBooking: (newDataBooking: IDataBooking) =>
    set(state => ({...state, dataBooking: newDataBooking})),
});


const validateGuestDataDevtool = devtools(validateGuestData)
const bookingStoreDevtool = devtools(bookingStore);
const authStoreDevtool = devtools(authStore);
const brandStoreDevtool = devtools(brandStore);
const authGuestStoreDevtool = devtools(authGuestStore);
const dataBookingStoreDevtool = devtools(dataBookingStore);


export const useValidateGuestStore = create<ValidateGuestDataProp>(validateGuestDataDevtool)
export const useBookingStore = create<BookingStoreProp>(bookingStoreDevtool);
export const useAuthStore = create<AuthProp>(authStoreDevtool);
export const useBrandStore = create<UseBrandProp>(brandStoreDevtool);
export const useAuthGuestStore = create<AuthProp>(authGuestStoreDevtool);
export const useDataBookingStore = create<IDataBookingStore>(
  dataBookingStoreDevtool
);
