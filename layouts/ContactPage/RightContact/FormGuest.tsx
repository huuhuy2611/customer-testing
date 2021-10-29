import React, { useState, useEffect } from "react";
// import {FlagSingaporeIcon} from "@/assets/img";
import MyOutlinedInput from "@/components/Input/MyOutlinedInput";
import {
  useAuthGuestStore,
  UseBrandProp,
  useBrandStore,
  useValidateGuestStore,
} from "@/store/store";
import SelectCountry from "@/components/SelectCountry";

export interface IBookingByGuest {
  email: string;
  phone: string;
  firstname: string;
  lastname: string;
}

interface IError {
  error: boolean;
  helperText: string;
}
export interface ILabelError {
  phone: IError;
  firstname: IError;
  lastname: IError;
}

interface IFormGuest {
  email: string;
  setShowCheckEmail: React.Dispatch<React.SetStateAction<boolean>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setIsOpacity?: React.Dispatch<React.SetStateAction<boolean>>;
}

function FormGuest({
  email,
  setEmail,
  setShowCheckEmail,
  setIsOpacity,
}: IFormGuest): JSX.Element {
  const [labelError, setLabelError] = useState<ILabelError>({
    phone: {
      error: false,
      helperText: "",
    },
    firstname: {
      error: false,
      helperText: "",
    },
    lastname: {
      error: false,
      helperText: "",
    },
  });

  const brand = useBrandStore((state: UseBrandProp) => state.brand);

  const dataGuest = useAuthGuestStore(state => state.user);
  const setDataGuest = useAuthGuestStore(state => state.setUser);
  const validateGuestData = useValidateGuestStore(state => state);

  useEffect(() => {
    const data = validateGuestData?.data;
    if (data.firstName)
      setLabelError(preState => ({
        ...preState,
        firstname: {
          error: true,
          helperText: "Please enter your first name",
        },
      }));
    if (data.lastName)
      setLabelError(preState => ({
        ...preState,
        lastname: {
          error: true,
          helperText: "Please enter your last name",
        },
      }));
  }, [validateGuestData]);

  const resetError = (name: "phone" | "firstname" | "lastname") => {
    setLabelError(preState => ({
      ...preState,
      [name]: {
        error: false,
        helperText: "",
      },
    }));
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    // numberphone < 8 character
    if (!(name === "phone" && value.length > 8))
      setDataGuest({
        ...dataGuest,
        email,
        [name]: value,
      });

    if (name === "phone" && value.length === 8) resetError("phone");
  };

  const handleBlurInput = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    switch (name) {
      case "firstname": {
        const regex = new RegExp(/^[a-zA-Z]+(([a-zA-Z ])?[a-zA-Z]*)*$/g);
        if (!regex.test(value)) {
          setLabelError(preState => ({
            ...preState,
            [name]: {
              error: true,
              helperText: "Please enter your first name",
            },
          }));
          setDataGuest({
            ...dataGuest,
            firstname: "",
          });
        } else resetError(name);
        break;
      }

      case "lastname": {
        const regex = new RegExp(/^[a-zA-Z]+(([a-zA-Z ])?[a-zA-Z]*)*$/g);
        if (!regex.test(value)) {
          setLabelError(preState => ({
            ...preState,
            [name]: {
              error: true,
              helperText: "Please enter your last name",
            },
          }));
          setDataGuest({
            ...dataGuest,
            lastname: "",
          });
        } else resetError(name);
        break;
      }

      default:
        break;
    }
  };

  const handleChangeEmail = () => {
    if (setIsOpacity) setIsOpacity(true);
    setEmail("");
    setShowCheckEmail(true);
    setDataGuest({
      email: "",
      firstname: "",
      lastname: "",
      phone: "",
    });
  };

  return (
    <div className="form-guest">
      <div className="mb-16">
        <MyOutlinedInput
          disabled
          fullWidth
          label="Email address"
          value={email}
          InputProps={{
            endAdornment: (
              <button
                onClick={handleChangeEmail}
                className="btn-change"
                type="button"
              >
                Change
              </button>
            ),
          }}
        />
      </div>
      <div className="mb-16">
        <MyOutlinedInput
          name="firstname"
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          // disabled
          fullWidth
          label="First Name"
          helperText={labelError?.firstname?.helperText}
          error={labelError?.firstname?.error}
        />
      </div>
      <div className="mb-16">
        <MyOutlinedInput
          // disabled
          fullWidth
          name="lastname"
          onBlur={handleBlurInput}
          onChange={handleChangeInput}
          label="Last Name"
          helperText={labelError?.lastname?.helperText}
          error={labelError?.lastname?.error}
        />
      </div>
      <div className="mb-16">
        <SelectCountry
          defaultCountryCode={brand?.countryCode}
          labelError={labelError}
          setLabelError={setLabelError}
        />
      </div>
      <style jsx>
        {`
          .form-guest {
            :global(.btn-change) {
              padding: 0;
              margin: 0;
              background-color: transparent;
              border: none;
              cursor: pointer;
              text-decoration-line: underline;
              font-size: 14px;
              font-family: "Jost";
              color: #000000;
            }
          }
        `}
      </style>
    </div>
  );
}

export default FormGuest;
