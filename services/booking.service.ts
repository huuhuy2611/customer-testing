import {
  IAvailableServiceTiming,
  IBrandResponse,
  ICancelBooking,
  IReservationResponse,
  IResponseBlockOutDate,
  IResponseError,
  IResponseMenuPdf
} from "@/common/interface";
import axios from "axios";
import { API_URL } from "common/config";
import authHeader from "./authHeader";

export interface IDataBooking {
  outletId: string;
  serviceTimingId: string;
  reservationDate: string;
  numberOfAdults: number;
  numberOfChildren: number;
  notes: string;
  reservationTime: string;
  occasions: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    updateOddlePassInfo?: boolean;
    acceptMarketing: true,
    acceptBrandMarketing: boolean;
  } | null;
}


class BookingService {
  getListOutlet = async (branch: string) =>
    axios
      .get(`${API_URL as string}brands/${branch}`)
      .then((response: { data: IBrandResponse }) => response.data)
      .catch(
        (error: { response: { data: IResponseError } }) =>
          error?.response?.data?.message
      );

  getListTime = async (outletId: string, date: string, pax: number) =>
    axios
      .get(
        `${API_URL as string
        }service-timings/available?outletId=${outletId}&pax=${pax}&date=${date}`
      )
      .then(
        (response: { data: Array<IAvailableServiceTiming> }) => response.data
      )
      .catch(
        (error: { response: { data: IResponseError } }) =>
          error?.response?.data?.message
      );

  bookingByGuest = async (data: IDataBooking) => {
    const {
      outletId,
      serviceTimingId,
      reservationDate,
      numberOfAdults,
      numberOfChildren,
      notes,
      reservationTime,
      occasions,
      user
    } = data;
    return axios
      .post(`${API_URL as string}reservations/create-by-guest`, {
        outletId,
        serviceTimingId,
        reservationDate,
        numberOfAdults,
        numberOfChildren,
        notes,
        reservationTime,
        occasions,
        user
      })
      .then((response: { data: IReservationResponse }) => response.data)
      .catch(
        (error: { response: { data: IResponseError } }) =>
          error?.response?.data?.message
      );
  };

  bookingByUser = async (data: IDataBooking) => {
    const {
      outletId,
      serviceTimingId,
      reservationDate,
      numberOfAdults,
      numberOfChildren,
      notes,
      reservationTime,
      occasions,
      user
    } = data;
    return axios
      .post(
        `${API_URL as string}reservations/create-by-user`,
        {
          outletId,
          serviceTimingId,
          reservationDate,
          numberOfAdults,
          numberOfChildren,
          notes,
          reservationTime,
          occasions,
          user
        },
        {
          headers: authHeader()
        }
      )
      .then((response: { data: IReservationResponse }) => response.data)
      .catch(
        (error: { response: { data: IResponseError } }) =>
          error?.response?.data?.message
      );
  };

  getBooking = async (data: { id: string; token: string }) => {
    const { id, token } = data;
    return axios
      .post(`${API_URL as string}reservations/${id}/share`, { token })
      .then((response: { data: IReservationResponse }) => response.data)
      .catch(
        (error: { response: { data: IResponseError } }) =>
          error?.response?.data?.message
      );
  };

  getMenuPdf = async (brandId: string) => (
    axios
      .get(`${API_URL as string}pdf-menu?brandId=${brandId}`)
      .then((response: { data: IResponseMenuPdf[] }) => response.data)
      .catch(
        (error: { response: { data: IResponseError } }) =>
          error?.response?.data?.message
      )
  )

  getBlockOutDate = async (outletId: string, pax: number, month: string) => (
    axios
      .get(`${API_URL as string}service-timings/available-by-month?outletId=${outletId}&pax=${pax}&month=${month}`)
      .then((response: { data: IResponseBlockOutDate[] }) => response.data)
      .catch(
        (error: { response: { data: IResponseError } }) =>
          error?.response?.data?.message
      )
  )

  cancelBooking = (data: { id: string; token: string }) => {
    const { id, token } = data;
    return axios
      .put(`${API_URL as string}reservations/${id}/cancel-by-guest`, { token })
      .then((response: { data: ICancelBooking }) => response.data)
      .catch(
        (error: { response: { data: IResponseError } }) =>
          error?.response?.data?.message
      );
  };
}

export default new BookingService();
