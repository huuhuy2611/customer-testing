/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from "axios";
import {API_URL, REDIRECT_URL} from "common/config";
import {SegmentAnalytics} from "@segment/analytics.js-core";
import {IAuthLogin, IResponseError, ICheckEmailExist} from "@/common/interface";

declare global {
  interface Window {
    analytics: SegmentAnalytics.AnalyticsJS;
  }
}

const API_URL_AUTH = `${API_URL as string}oddle-pass/`;

class AuthService {
  login = async (emailBody: string, password: string, countryCode: string, outletId: string) =>
    axios
      .post(
        `${API_URL_AUTH}signin`,
        {
          email: emailBody,
          password,
          countryCode,
          outletId,
        },
        {withCredentials: true}
      )
      .then((response: {data: IAuthLogin}) => {
        localStorage.setItem("reserve_token", response.data.token);
        return {...response.data, success: true};
      })
      .catch(
        (error: {response: {data: IResponseError}}) =>
          error?.response?.data?.message
      );

  loginByHash = async (hash: string) =>
    axios
      .post(`${API_URL_AUTH}customers/hash`, {
        hash,
      })
      .then((response: {data: IAuthLogin}) => {
        localStorage.setItem("reserve_token", response.data.token);
        return response.data;
      })
      .catch(
        (error: {response: {data: IResponseError}}) =>
          error?.response?.data?.message
      );

  checkEmail = async (email: string) => {
    try {
      const response: {data: ICheckEmailExist} = await axios.get(
        `${API_URL_AUTH}customers?email=${email}`
      );
      return response?.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return error.response.data as ICheckEmailExist;
    }
  };

  register = async (
    email: string,
    lastName: string,
    firstName: string,
    phone: string,
    password: string,
    acceptMarketing = true,
    countryCode: string,
    outletId: string,
  ) =>
    axios
      .post(
        `${API_URL_AUTH}signup`,
        {
          password,
          lastName,
          firstName,
          phone,
          email,
          acceptMarketing,
          countryCode,
          outletId,
        },
        {withCredentials: true}
      )
      .then((response: {data: IAuthLogin}) => {
        localStorage.setItem("reserve_token", response.data.token);
        return {...response.data, success: true};
      })
      .catch(
        (error: {response: {data: IResponseError}}) =>
          error?.response?.data?.message
      );

  resetPass = async (email: string) =>
    axios
      .post(`${API_URL_AUTH}customers/send-email-reset-password`, {
        email,
        parentUrl: `${REDIRECT_URL as string}/${
          localStorage.getItem("brandShortName") as string
        }`,
      })
      .then((response: {data: {success: boolean}}) => response.data.success)
      .catch(
        (error: {response: {data: {success: boolean; message: string}}}) =>
          error?.response?.data?.message
      );

  inSession = async () =>
    axios
      .request({
        url: `${API_URL_AUTH}customers/in-session`,
        method: "get",
        withCredentials: true,
      })
      .then((response: {data: {user: IAuthLogin}}) => response.data.user)
      .catch(
        (error: {response: {data: {success: boolean; message: string}}}) =>
          error?.response?.data?.message
      );

  getAccessToken = async (oddlePassId: string) =>
    axios
      .post(`${API_URL_AUTH}customers/access-token`, {oddlePassId})
      .then((response: {data: IAuthLogin}) => {
        localStorage.setItem("reserve_token", response.data.token);
        return response.data;
      })
      .catch(
        (error: {response: {data: {success: boolean; message: string}}}) =>
          error?.response?.data?.message
      );

  getDataUserByWidgetToken = async (token: string) =>
    axios
      .post(`${API_URL_AUTH}customers/token`, {token})
      .then((response: {data: IAuthLogin}) => response.data)
      .catch(
        (error: {response: {data: {success: boolean; message: string}}}) =>
          error?.response?.data?.message
      );
}

export default new AuthService();
