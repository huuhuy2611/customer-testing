/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useState } from "react";
import { getRegexs, IGetRegexs } from "../../constant/Regex";

function handleValidation(value: string, regex: RegExp) {
  // we could get fancy here with validations based on type of input
  // could be put in a form hook library and imported
  if (value && regex && regex.exec(value)) return true;
  return false;
}

export interface IUseInput {
  props: {
    name: string;
    value: string;
    helperText: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    error: boolean;
  };
  setValueInput: (valueInput: string) => void;
}

interface ITypeError {
  typeError: "EMAIL" | "PASSWORD" | "PHONE" | "FIRSTNAME" | "LASTNAME";
}

function useInput(
  name: "email" | "password" | "phone" | "firstname" | "lastname" | string,
  defaultValue: string,
  type?: string
): IUseInput {
  const typeRegex = type?.toUpperCase();
  const typeName = name?.toUpperCase();
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<boolean>(false);
  const [helperText, setHelpText] = useState<string>("");
  const errorText = {
    EMAIL: [
      "Please enter your email address to continue",
      "Please enter a valid email address e.g john@oddle.me",
    ],
    PHONE: [
      "Phone number seems to be incorrect. Please check that it is a valid number.",
      "Phone number seems to be incorrect. Please check that it is a valid number.",
    ],
    FIRSTNAME: ["Please enter your first name"],
    LASTNAME: ["Please enter your last name"],
    PASSWORD: [
      "Please enter your password to continue",
      "Please ensure the password contains at least 8 characters",
    ],
  };

  const getErrorText = ({ typeError }: ITypeError) => errorText[typeError];

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (name === "phone" && e.target.value.length > 8) return;
    setValue(e.target.value);
    setError(false);
    setHelpText("");
  }

  function handleValidate() {
    // debugger;
    let valid;
    if (typeRegex === "NOREQUIRE") valid = true;
    else
      valid = type
        ? handleValidation(value, getRegexs({ type: typeRegex } as IGetRegexs))
        : Boolean(value);
    setError(!valid);
    if (!valid) {
      if (value)
        setHelpText(getErrorText({ typeError: typeName } as ITypeError)[1]);
      else setHelpText(getErrorText({ typeError: typeName } as ITypeError)[0]);
    } else setHelpText("");

    return valid;
  }

  function handleBlur() {
    handleValidate();
  }

  function setValueInput(valueInput: string) {
    setValue(valueInput);
  }

  return {
    props: {
      name,
      value,
      helperText,
      onChange: handleChange,
      onBlur: handleBlur,
      error,
    },
    setValueInput,
  };
}

// function useSubmit() {
//   // TODO: custom hook useSubmit here
// }

export default { useInput };
