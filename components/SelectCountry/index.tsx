import React, { useEffect } from "react";
import IntlTelInput, { CountryData } from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import { useAuthGuestStore, useValidateGuestStore } from "@/store/store";
import { ILabelError } from "@/layouts/ContactPage/RightContact/FormGuest";

interface IProps {
  defaultCountryCode?: string;
  labelError: ILabelError;
  setLabelError: React.Dispatch<React.SetStateAction<ILabelError>>;
}

function SelectCountry(props: IProps): JSX.Element {
  const { defaultCountryCode, labelError, setLabelError } = props;

  const dataGuest = useAuthGuestStore(state => state.user);
  const setDataGuest = useAuthGuestStore(state => state.setUser);

  const validateGuestData = useValidateGuestStore(state => state);

  useEffect(() => {
    const data = validateGuestData?.data;
    if (data?.phone)
      setLabelError({
        ...labelError,
        phone: {
          error: true,
          helperText:
            "Phone number seems to be incorrect. Please check that it is a valid number.",
        },
      });
  }, [validateGuestData]);

  const handleChangePhone = (isValid: boolean) => {
    if (isValid) {
      setLabelError({
        ...labelError,
        phone: {
          error: false,
          helperText: "",
        },
      });
    }
  };

  const handleChangePhoneBlur = (
    isValid: boolean,
    value: string,
    selectedCountryData: CountryData
  ) => {
    if (isValid) {
      let phone = value;
      if (value.includes(`+${selectedCountryData?.dialCode as string}`)) {
        phone = value;
      } else if (selectedCountryData.dialCode) {
        phone = `+${selectedCountryData.dialCode}${value}`;
      }
      setDataGuest({
        ...dataGuest,
        phone,
        countryCode: selectedCountryData?.iso2?.toUpperCase(),
      });
    } else {
      setLabelError({
        ...labelError,
        phone: {
          error: true,
          helperText:
            "Phone number seems to be incorrect. Please check that it is a valid number.",
        },
      });
      setDataGuest({
        ...dataGuest,
        phone: "",
        countryCode: "",
      });
    }
  };

  return (
    <div className="custom-select-country">
      <IntlTelInput
        preferredCountries={["sg"]}
        defaultCountry={
          defaultCountryCode ? defaultCountryCode.toLocaleLowerCase() : "sg"
        }
        onPhoneNumberChange={isValid => handleChangePhone(isValid)}
        onPhoneNumberBlur={(isValid, value, selectedCountryData) =>
          handleChangePhoneBlur(isValid, value, selectedCountryData)
        }
        // format
        autoPlaceholder
        placeholder="Phone number"
      />
      {labelError?.phone?.error && (
        <p className="text-helper">{labelError?.phone?.helperText}</p>
      )}
      <style jsx>{`
        .custom-select-country {
          width: 100%;
          :global(.intl-tel-input) {
            width: 100%;
          }
          :global(.intl-tel-input input) {
            width: 100%;
            height: 52px;
            border: 1px solid #d5d5d5;
            border-radius: 3px;
            border-color: ${labelError?.phone?.error ? "#D62105" : ""};
            &::placeholder {
              color: ${labelError?.phone?.error ? "#D62105" : ""};
              opacity: 1;
            }
          }
          .text-helper {
            color: #d62105;
            font-family: Jost;
            margin-top: 3px;
            margin-left: 14px;
            margin-right: 14px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default SelectCountry;
