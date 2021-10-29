import {BrandProp, OutletProp, TimeProp} from "@/store/store";

export type IGetListOutLet = {
  id: string;
  brandName: string;
  brandShortName: string;
  brandLogo: string;
  enabled: boolean;
  brandReceiptLogo: string;
  brandCoverImage: string;
  createdTimestamp: string;
  modifiedTimestamp: string;
};

export interface IAvailableServiceTiming {
  id: string;
  outletId: string;
  name: string;
  startTime: string;
  endTime: string;
  availableTimeSlots: Array<string>;
  blockedReason: string | null;
}

// Interface authservice

export interface ITableType {
  id: string;
  outletId: string;
  legend: string;
  minPax: number;
  maxPax: number;
  numberOfTables: number;
  description: string;
  createdTimestamp: string;
  modifiedTimestamp: string;
}

export interface IUserBrands {
  userId: string;
  brandId: string;
  acceptMarketing: boolean;
  createdBy: string | null;
  modifiedBy: string | null;
  createdTimestamp: string;
  modifiedTimestamp: string | null;
}

export interface IOccasionResponse {
  id: string;
  name: string;
  displayOrder?: number;
}
export interface IBrandResponse {
  id: string;
  brandName: string;
  brandShortName: string;
  brandLogo: string;
  enabled: boolean;
  brandReceiptLogo: string;
  brandCoverImage: string;
  createdTimestamp: string;
  modifiedTimestamp: string;
  outlets?: Array<IOutletResponse>;
  occasions: Array<IOccasionResponse>;
  countryCode: string;
}

export interface IOutletResponse {
  id: string;
  brandId: string;
  countryCode: string;
  outletName: string;
  outletAddress: string;
  deprecated: true;
  autoCompleteString: string;
  address1: string;
  address2: string;
  state: string;
  city: string;
  country: string;
  postal: string;
  operationHours: string;
  directionLink: string;
  phone: string;
  email: string;
  outletReceiptFooter: string;
  outletLogo: string;
  outletReceiptLogo: string;
  outletReceiptFooterLogo: string;
  outletCoverImage: string;
  outletColorLogo: string;
  outletMenuItemView: string;
  lat: string;
  lng: string;
  enabled: number;
  modifiedTimestamp: string;
  createdTimestamp: string;
  liteVersion: number;
  reservationLeadTime: number;
  reservationGracePeriod: number;
  reservationDiningInterval: number;
  reservationPolicy: string;
  reservationCancellationPolicy: string;
  maxPaxPerReservation: number;
  brand: IBrandResponse;
}

export interface IReservationResponse {
  token?: string;
  id: string;
  code: string;
  outletId: string;
  serviceTimingId: string;
  customerId: string;
  reservationDate: string;
  reservationTime: string;
  numberOfAdults: number;
  numberOfChildren: number;
  status: number;
  notes: string;
  occasions: string;
  createdByRestaurant: boolean;
  modifiedByRestaurant: boolean;
  cancelledByRestaurant: boolean;
  cancelledAt: string;
  seatedAt: string;
  departedAt: string;
  createdTimestamp: string;
  modifiedTimestamp: string;
  pax: number;
  outlet: IOutletResponse;
  user?: {
    email: string;
    lastName: string;
    firstName: string;
    phone: string;
  };
  tableTypes: ITableType;
  // serviceTiming?:
}

export interface IResponseMenuPdf {
  name: string;
  id: string;
  fileLink: string;
  fileName: string;
  displayOrder: string;
}

export interface IResponseBlockOutDate {
  blockedReason: string;
  date: string;
}

export interface IAuthLogin {
  token: string;
  id: string;
  oddlePassId: string;
  favouriteItemIds: string;
  username: string;
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  additionalPhone: string;
  organisationName: string;
  address: string;
  gender: number;
  birthday: string;
  barcode: string;
  language: string;
  postalCode: string;
  countryCode: string;
  state: string;
  city: string;
  canSendSmsMarketing: number;
  createdTimestamp: string;
  canSendEmailMarketing: boolean;
  modifiedTimestamp: string;
  userBrands: IUserBrands;
  reservations?: IReservationResponse;
  success?: string;
}

export interface IResponseError {
  statusCode: number;
  message: string;
  success?: boolean;
  type?: string;
  data?: null;
  timestamp: string;
  rawMessage?: Array<string>;
}

export interface ICheckEmailExist {
  success: boolean;
  message: string;
  user?: IUserCheckEmail;
}

export interface IUserCheckEmail {
  email: string;
  firstName: string;
  lastName: string;
  salutation: string;
}

export interface ICancelBooking {
  success: boolean;
  message: string;
}

export interface IWigetProvider {
  type?: string;
  outletId?: string;
  iframe?: boolean;
  brandShortName?: string;
  date?: string;
  timeslot?: string;
  adult?: string; // default 2
  child?: string; // default 0
  modalId?: string;
  token?: string;
}

export interface IWidgetContactData {
  brand: BrandProp;
  time: TimeProp;
  date: string;
  numAdults: number;
  numChild: number;
  outlet: OutletProp;
  isUsingIframe?: boolean;
  token?: string;
}
