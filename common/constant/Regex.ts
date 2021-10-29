/* eslint-disable no-useless-escape */
export interface IGetRegexs {
  type: "EMAIL" | "NUMBER" | "PASSWORD" | "PHONE";
}

export const REGEXS = {
  EMAIL:
    /^[_A-Za-z0-9-+]+(\.[_A-Za-z0-9-+]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/,
  NUMBER: /^\d*$/,
  PASSWORD: /^.{8,}$/,
  PHONE: /^.{8}$/
};

export const getRegexs = ({ type }: IGetRegexs): RegExp => REGEXS[type];

export const REGEX_ANRDOID = /Android/i;
export const REGEX_IOS = /iPhone|iPad/i;
