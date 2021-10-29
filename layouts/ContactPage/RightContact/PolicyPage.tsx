import ReactHtmlParser from "react-html-parser";
import React, { useState } from "react";
import { useRouter } from "next/router";
import InlineNotification from "@/components/InlineNotification";
import {
  useAuthGuestStore,
  useBookingStore,
  useBrandStore,
} from "@/store/store";
import CustomButtonNew from "@/components/Button/CustomButton";
import BookingService, { IDataBooking } from "@/services/booking.service";
import AuthService from "@/services/auth.service";

interface IProps {
  dataBooking: IDataBooking;
  setShowPolicy: (arg0: boolean) => void;
}

function PolicyPage({ dataBooking, setShowPolicy }: IProps): JSX.Element {
  const outlet = useBookingStore((state) => state.outlet);
  const dataGuest = useAuthGuestStore((state) => state.user);
  const brand = useBrandStore((state) => state.brand);

  const policies = outlet?.reservationPolicy
    ? ReactHtmlParser(outlet?.reservationPolicy)
    : "";
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [bookingFailed, setBookingFailed] = useState<boolean>(false);

  const handleBooking = async () => {
    setLoading(true);
    if (!dataGuest?.email) {
      const res = await BookingService.bookingByUser(dataBooking);
      setLoading(false);
      if (typeof res === "string") {
        setBookingFailed(true);
        // router.push({
        //   pathname: `/${brand.shortName}`,
        //   query: {
        //     reserveError: true,
        //     message: res,
        //   },
        // });
      } else {
        router.push({
          pathname: `/${brand.shortName}/${res?.id}/${res?.token as string}`,
        });
      }
    } else {
      const response = await AuthService.checkEmail(dataGuest?.email);
      const res = await BookingService.bookingByGuest(dataBooking);
      setLoading(false);
      if (typeof res === "string") {
        setBookingFailed(true);
        // router.push({
        //   pathname: `/${brand.shortName}`,
        //   query: {
        //     reserveError: true,
        //     message: res,
        //   },
        // });
      } else if (res?.id && !response.success) {
        router.push({
          pathname: `/${brand.shortName}/${res?.id}/${res?.token as string}`,
        });
      } else if (res?.id && response.success)
        router.push({
          pathname: `/${brand.shortName}/${res?.id}/${res?.token as string}`,
        });
    }
  };

  const pushHome = () => router.push(`/${brand.shortName}`);

  return (
    <div className="policy-page">
      <div className="header">
        <div className="label">
          <h2>Before you continue...</h2>
          <button
            onClick={() => setShowPolicy(false)}
            className="btn-back"
            type="button"
          >
            Back
          </button>
        </div>
      </div>
      <InlineNotification
        type="general"
        content="Please read and accept all policies to complete your reservation."
      />
      <div className="list-policies mb-20">
        <ul>{policies && policies}</ul>
      </div>
      <CustomButtonNew
        onClick={handleBooking}
        loading={loading}
        text="Accept Policies and Proceed"
        type="primary"
        disabled={bookingFailed}
      />
      {bookingFailed && (
        <p className="book-error">
          The time slot you selected has expired.{" "}
          <button type="button" className="rm-btn" onClick={pushHome}>
            Select another timeslot
          </button>
        </p>
      )}
      <style jsx>
        {`
          .policy-page {
            .header {
              height: 56px;
              margin-bottom: 20px;
              border-bottom: 1px solid #d6d6d6;
              display: flex;
              align-items: center;
              .label {
                position: relative;
                margin-bottom: 20px;
                width: 100%;
                h2 {
                  color: #000000;
                  font-size: 24px;
                  line-height: 30px;
                }
                .btn-back {
                  position: absolute;
                  bottom: 3px;
                  right: 0;
                  background: none;
                  border: none;
                  text-decoration: underline;
                  color: #959595;
                  font-size: 14px;
                  line-height: 20px;
                  font-family: "Jost";
                  cursor: pointer;
                }
              }
            }
            .list-policies {
              ul {
                padding: 0;
                max-height: 340px;
                overflow-y: auto;
                list-style: "・";
                text-align: left;
                font-size: 16px;
                line-height: 20px;
                color: rgba(0, 0, 0, 0.87);
              }
              :global(p, li) {
                margin-bottom: 10px;
              }
            }
            .book-error {
              color: #d62105;
              font-size: 12px;
              text-align: center;
              margin-top: 10px;
              button {
                text-decoration: underline;
                color: #d62105;
                font-size: 12px;
                font-family: "Jost";
              }
            }
          }
        `}
      </style>
    </div>
  );
}

export default PolicyPage;
