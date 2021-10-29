/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import BookingService from "services/booking.service";
import router from "next/router";
import {STATE_BOOKING} from "@/common/constant/Enum";
import {IReservationResponse} from "@/common/interface";
import ReservationConfirmed from "@/layouts/GuestReservation/ReservationConfirmed";
import ReservationCancelled from "@/layouts/GuestReservation/CancelReserve/ReservationCancelled";
import ReservationExpired from "@/layouts/GuestReservation/CancelReserve/ReservationExpired";
import Footer from "@/layouts/Footer";
import ConfirmCancel from "@/layouts/GuestReservation/CancelReserve/ConfirmCancel";
import {ImageDefault} from "@/assets/img";

function Reserve(): JSX.Element {
  const {id, token, brandShortName, confirmCancel} = router.query;

  const [stateBooking, setStateBooking] = useState("");
  const [dataBooking, setDataBooking] = useState<IReservationResponse>();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const getDataBooking = async () => {
    const res = await BookingService.getBooking({
      id: id as string,
      token: token as string,
    });
    if (typeof res === "string") router.push("/oops");
    else if (brandShortName !== res?.outlet?.brand?.brandShortName) {
      //   router.push({
      //     pathname: `/${res?.outlet?.brand?.brandShortName}/${res?.id}/${
      //       res?.token as string
      //     }`,
      //   });
      switch (res.status) {
        // case 1: {
        //   setStateBooking(STATE_BOOKING.BOOKED);
        //   break;
        // }
        // case 2: {
        //   setStateBooking(STATE_BOOKING.COMPLETE);
        //   break;
        // }
        // case 3: {
        //   setStateBooking(STATE_BOOKING.COMPLETE);
        //   break;
        // }
        case 4: {
          setStateBooking(STATE_BOOKING.CANCEL);
          break;
        }
        case 5: {
          setStateBooking(STATE_BOOKING.EXPIRED);
          break;
        }
        case 6: {
          setStateBooking(STATE_BOOKING.CONFIRM);
          break;
        }
        default:
          setStateBooking(STATE_BOOKING.CONFIRM);
          break;
      }
      setDataBooking(res);
    }
  };

  useEffect(() => {
    if (router.query.id) {
      getDataBooking();
    }
    if (confirmCancel === "true") setShowCancelDialog(true);
  }, [router.query.id]);

  const cancelDataBooking = async () => {
    const res = await BookingService.cancelBooking({
      id: id as string,
      token: token as string,
    });
    if (typeof res !== "string") {
      await getDataBooking();
      setShowCancelDialog(false);
    }
  };

  const handleGoBack = () => {
    setShowCancelDialog(false);
  };

  const generateBooking = (): JSX.Element => {
    switch (stateBooking) {
      case STATE_BOOKING.CONFIRM:
        return (
          <ReservationConfirmed
            data={dataBooking as IReservationResponse}
            setShowCancelDialog={setShowCancelDialog}
          />
        );
      case STATE_BOOKING.CANCEL:
        return (
          <ReservationCancelled data={dataBooking as IReservationResponse} />
        );
      case STATE_BOOKING.EXPIRED:
        return (
          <ReservationExpired data={dataBooking as IReservationResponse} />
        );
      default:
        break;
    }
    return <></>;
  };

  return (
    <div className="reserve">
      <div className="bg-gradient" />
      <div className="main-content">
        <div className="div-logo">
          <img
            src={dataBooking?.outlet?.brand?.brandLogo || ImageDefault.src}
            alt="logo"
          />
        </div>
        {showCancelDialog ? (
          <ConfirmCancel
            handleCancel={cancelDataBooking}
            handleGoBack={handleGoBack}
          />
        ) : (
          generateBooking()
        )}
      </div>
      <div className="footer">
        <Footer />
      </div>
      <style jsx>{`
        .reserve {
          margin-top: 60px;
          min-height: calc(100vh - 60px);
          height: calc(100% - 60px);
          width: 100%;
          display: flex;
          justify-content: center;
          position: relative;
          .bg-gradient {
            position: absolute;
            height: 7%;
            width: 100%;
            left: 0px;
            z-index: 0;
            background: linear-gradient(
              180deg,
              #c4c4c4 0%,
              rgba(196, 196, 196, 0) 54.2%
            );
            opacity: 0.15;
          }
          .main-content {
            z-index: 1;
            width: 414px;
            @media (max-width: 414px) {
              min-width: 350px;
              max-width: 414px;
            }
            .div-logo {
              img {
                position: relative;
                top: -40px;
                left: calc(50% - 40px);
                width: 80px;
                height: 80px;
                border-radius: 50%;
                border: 1px solid #d6d6d6;
                @media (max-width: 800px) {
                  top: -32px;
                  left: calc(50% - 32px);
                  width: 64px;
                  height: 64px;
                }
              }
            }
          }
        }
      `}</style>
      <style jsx>{`
        .footer {
          height: 40px;
          width: 414px;
          position: absolute;
          bottom: ${stateBooking === STATE_BOOKING.CONFIRM ? "-60px" : "40px"};
          z-index: 10;
          @media (max-width: 800px) {
            max-width: 414px;
            width: 100%;
            bottom: ${stateBooking === STATE_BOOKING.CONFIRM
              ? "-60px"
              : "20px"};
          }
          @media (max-height: 880px) {
            bottom: ${stateBooking !== STATE_BOOKING.CONFIRM ? "30px" : ""};
          }
          @media (max-height: 850px) {
            bottom: ${stateBooking !== STATE_BOOKING.CONFIRM ? "20px" : ""};
          }
          @media (max-height: 820px) {
            bottom: ${stateBooking !== STATE_BOOKING.CONFIRM ? "-20px" : ""};
          }
          @media (max-height: 800px) {
            bottom: ${stateBooking !== STATE_BOOKING.CONFIRM ? "-60px" : ""};
          }
        }
      `}</style>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Reserve), {
  ssr: false,
});
