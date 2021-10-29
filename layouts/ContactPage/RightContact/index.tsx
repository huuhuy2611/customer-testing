import React, { useState, useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import Footer from "@/layouts/Footer";
import StepLabel from "@/layouts/StepLabel";
import { MyCheckbox } from "@/components/Button/Checkbox";
import CustomButtonNew from "@/components/Button/CustomButton";
import Divider from "@/components/Divider";
import authService from "@/services/auth.service";
import LoginOddle from "@/layouts/LoginOddle";
import { IAuthLogin, IUserCheckEmail } from "@/common/interface";
import {
  BookingStoreProp,
  IDataBookingStore,
  useAuthGuestStore,
  useBookingStore,
  useDataBookingStore,
  useValidateGuestStore,
} from "@/store/store";
import { IDataBooking } from "@/services/booking.service";
import { dayOfWeek } from "@/layouts/HomePage/RightHome/tool";
import FormGuest from "./FormGuest";
import CheckEmail from "./CheckEmail";
import Occasions from "./Occasions";
import TextArea from "./TextArea";
import PolicyPage from "./PolicyPage";

enum MessageCheckEmail {
  EXIST = "User already exists",
  NOT_FOUND = "User not found",
}

interface IProps {
  showPolicy: boolean;
  setShowPolicy: React.Dispatch<React.SetStateAction<boolean>>;
}

function RightContact({ showPolicy, setShowPolicy }: IProps): JSX.Element {
  // store
  const store = useBookingStore((state: BookingStoreProp) => state);
  const dataHomePage = useDataBookingStore(
    (state: IDataBookingStore) => state.dataBooking
  );
  const dataGuest = useAuthGuestStore(state => state.user);
  const outlet = useBookingStore((state: BookingStoreProp) => state.outlet);

  const validateGuestData = useValidateGuestStore(state => state);

  // state
  const [email, setEmail] = useState("");
  const [showCheckEmail, setShowCheckEmail] = useState<boolean>(true);
  const [isExistEmail, setIsExistEmail] = useState<boolean | null>(null);
  const [infoEmailExisted, setInfoEmailExisted] = useState<IUserCheckEmail>();
  const [dataUser, setDataUser] = useState<IAuthLogin>();
  const [notes, setNotes] = useState<string>("");
  const [occasions, setOccasions] = useState<string>("");
  const [isOpacity, setIsOpacity] = useState(true);
  const [acceptBrandMarketing, setAcceptBrandMarketing] = useState(false);
  const [dataBooking, setDataBooking] = useState<IDataBooking>(
    {} as IDataBooking
  );
  const [hasCookie, setHasCookie] = useState<boolean>(false);
  const [hasTokenWidget, setHasTokenWidget] = useState<boolean>(false);
  const [oddlePassId, setOddlePassId] = useState<string>();
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);

  const handleCheckEmail = async () => {
    const checkEmail = await authService.checkEmail(email);
    if (checkEmail) {
      const { message, success } = checkEmail;
      if (message === MessageCheckEmail.EXIST && success) {
        setIsExistEmail(true);
        setInfoEmailExisted(checkEmail?.user);
      } else if (message === MessageCheckEmail.NOT_FOUND && !success) {
        setIsExistEmail(false);
        setIsOpacity(false);
      }
      setShowCheckEmail(false);
    }
  };

  const handleValidate = () => {
    let isError = false;
    if (isExistEmail && dataUser) return false;
    const newValidate = {
      phone: false,
      lastName: false,
      firstName: false,
    };
    if (dataGuest?.phone === "") {
      newValidate.phone = true;
      isError = true;
    }

    if (dataGuest?.lastname === "") {
      newValidate.lastName = true;
      isError = true;
    }

    if (dataGuest?.firstname === "") {
      newValidate.firstName = true;
      isError = true;
    }

    validateGuestData.setData(newValidate);

    return isError;
  };

  const handleBooking = () => {
    const checkValidate = handleValidate();
    if (checkValidate) return;

    const { numAdults, numChild } = store;
    const { outletId, serviceTimingId, reservationDate, reservationTime } =
      dataHomePage;
    if (isExistEmail) {
      setDataBooking({
        outletId,
        serviceTimingId,
        reservationDate,
        numberOfAdults: numAdults,
        numberOfChildren: numChild,
        notes,
        reservationTime,
        occasions,
        user: {
          email: dataUser?.email as string,
          firstName: dataUser?.firstName as string,
          lastName: dataUser?.lastName as string,
          phone: dataUser?.phone as string,
          acceptMarketing: true,
          acceptBrandMarketing,
        },
      });
    } else {
      setDataBooking({
        outletId,
        serviceTimingId,
        reservationDate,
        numberOfAdults: numAdults,
        numberOfChildren: numChild,
        notes,
        reservationTime,
        occasions,
        user: {
          email: dataGuest.email,
          firstName: dataGuest.firstname,
          lastName: dataGuest.lastname,
          phone: dataGuest?.phone,
          acceptMarketing: true,
          acceptBrandMarketing,
        },
      });
    }
    setShowPolicy(true);
  };

  const handleInSession = async () => {
    const res = await authService.inSession();
    if (typeof res !== "string" && res) {
      const { firstName, lastName, salutation } = res;
      setHasCookie(true);
      setOddlePassId(res?.oddlePassId);
      setShowCheckEmail(false);
      setIsExistEmail(true);
      setInfoEmailExisted({
        email: res.email,
        firstName,
        lastName,
        salutation: salutation as unknown as string,
      });
      setDataUser(res);
    }
  };

  const handleWidgetToken = async (tokenWidget: string) => {
    const res = await authService.getDataUserByWidgetToken(tokenWidget);
    if (typeof res !== "string" && res) {
      setHasTokenWidget(true);
      setDataUser(res);
      setIsExistEmail(true);
      setIsOpacity(false);
      sessionStorage.removeItem("token_widget");
    } else {
      setShowCheckEmail(true);
    }
    setIsLoadingEmail(false);
  };

  useEffect(() => {
    const tokenWidget = sessionStorage.getItem("token_widget");
    if (tokenWidget) {
      setShowCheckEmail(false);
      setIsLoadingEmail(true);
      handleWidgetToken(tokenWidget);
      return;
    }

    handleInSession();
  }, []);

  return (
    <div className="right-contact">
      {showPolicy ? (
        <PolicyPage setShowPolicy={setShowPolicy} dataBooking={dataBooking} />
      ) : (
        <>
          <StepLabel step={2} />
          <div className="d-flex justify-content-between">
            <h4 className="fs-18 mb-10">Contact Information</h4>
            {(hasCookie || isExistEmail) && (
              <button
                type="button"
                onClick={() => {
                  setHasTokenWidget(false);
                  setShowCheckEmail(true);
                  setHasCookie(false);
                  setEmail("");
                  setDataUser(undefined);
                  setIsExistEmail(false);
                  setIsOpacity(true);
                  sessionStorage.removeItem("token_widget");
                }}
                className="change-email"
              >
                Change
              </button>
            )}
          </div>
          {isLoadingEmail ? (
            <div className="div-center">
              <CircularProgress
                size={28}
                color={"white" as unknown as undefined}
              />
            </div>
          ) : (
            <>
              {showCheckEmail && (
                <CheckEmail
                  email={email}
                  setEmail={setEmail}
                  handleContinue={handleCheckEmail}
                />
              )}
              {!showCheckEmail &&
                (isExistEmail || hasCookie ? (
                  <LoginOddle
                    oddlePassId={oddlePassId}
                    hasCookie={hasCookie}
                    infoUser={infoEmailExisted as IUserCheckEmail}
                    setIsOpacity={setIsOpacity}
                    dataUser={dataUser as IAuthLogin}
                    setDataUser={setDataUser}
                    hasTokenWidget={hasTokenWidget}
                  />
                ) : (
                  <FormGuest
                    email={email}
                    setEmail={setEmail}
                    setShowCheckEmail={setShowCheckEmail}
                    setIsOpacity={setIsOpacity}
                  />
                ))}
            </>
          )}

          <div className="handle-disable-css">
            <Divider />
            <TextArea setValue={setNotes} />
            <Divider />
            <Occasions setValue={setOccasions} />
            <Divider />
            <div className="mb-20">
              <div className="fs-18 mb-20">Marketing Preference</div>
              <div
                className="check d-flex align-items-center"
                onClick={() => setAcceptBrandMarketing(!acceptBrandMarketing)}
                onKeyDown={() => {}}
                role="button"
                tabIndex={0}
              >
                <MyCheckbox
                  checked={acceptBrandMarketing}
                  onChange={() =>
                    setAcceptBrandMarketing(!acceptBrandMarketing)
                  }
                />
                <div className="ml-14">
                  Receive updates, news and promotions from {outlet?.outlet}
                </div>
              </div>
            </div>
            <CustomButtonNew
              text={`Reserve for ${dayOfWeek(dataHomePage?.reservationDate)}`}
              onClick={handleBooking}
              type="primary"
            />
          </div>

          <p className="mt-20 fs-12">
            By continuing, you agree to Oddle&apos;s{" "}
            <a
              target="_blank"
              href="https://oddle.me/oddle-pass-terms-of-use/"
              rel="noreferrer"
            >
              T&Cs
            </a>{" "}
            &{" "}
            <a
              target="_blank"
              href="https://oddle.me/privacy-policy"
              rel="noreferrer"
            >
              Privacy Policy
            </a>
          </p>
          <div className="footer">
            <Divider />
            <Footer />
          </div>
        </>
      )}
      <style jsx>
        {`
          .right-contact {
            padding: 0 16px;
            @media screen and (min-width: 800px) {
              padding: 0;
            }
            width: 375px;
            display: block;
            margin: 0 auto;
            @media (max-width: 375px) {
              width: 100%;
            }
            .change-email {
              border: none;
              background: none;
              padding: 0;
              margin: 0;
              height: 40px;
              cursor: pointer;
              text-decoration-line: underline;
              font-size: 14px;
              color: #000000;
              font-family: "Jost";
            }
          }
          .fs-12 {
            color: #393939;
            text-align: center;
            a {
              text-decoration: underline;
              cursor: pointer;
              color: #393939;
            }
          }
          .footer {
            @media screen and (min-width: 800px) {
              display: none;
            }
          }
          .check {
            cursor: pointer;
          }
        `}
      </style>
      <style jsx>{`
        .handle-disable-css {
          pointer-events: ${isOpacity ? "none" : "unset"};
          opacity: ${isOpacity ? 0.4 : 1};
        }
      `}</style>
    </div>
  );
}

export default RightContact;
