import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@material-ui/core";
import ReactHtmlParser from "react-html-parser";
import moment from "moment";
import copy from "copy-to-clipboard";
import _ from "lodash";
import { IconConfirm, IconLink } from "@/assets/img";
import CustomButtonNew from "@/components/Button/CustomButton";
import MyOutlinedInput from "@/components/Input/MyOutlinedInput";
import CreateAsGuest from "@/layouts/LoginOddle/CreateAsGuest";
import MapConfirmReserve from "@/layouts/StoreMap/MapConfirmReserve";
import { IReservationResponse, IResponseMenuPdf } from "@/common/interface";
import { convertTime } from "@/common/ultil/convertTime";
import bookingService from "@/services/booking.service";
import { useAuthGuestStore } from "@/store/store";
import InfoReserveDetail from "../components/InfoReserveDetail";
import InfoOutlet from "../components/InfoOutlet";

interface IProps {
  data: IReservationResponse;
  setShowCancelDialog: (arg0: boolean) => void;
}

function ReservationConfirmed(props: IProps): JSX.Element {
  const { data, setShowCancelDialog } = props;

  const dataGuest = useAuthGuestStore(state => state.user);

  const policies =
    data?.outlet?.reservationPolicy !== "<p></p>"
      ? ReactHtmlParser(data?.outlet?.reservationPolicy).map(item => ({
          ...item,
          type: "li",
        }))
      : "";
  const [copied, setCopied] = useState(false);
  const [menuPdf, setMenuPdf] = useState<IResponseMenuPdf[]>();

  const breakpointUp = (minWidth: number) =>
    useMediaQuery(`(min-width:${minWidth}px)`);

  const handleClickOpen = () => {
    navigator.share({
      title: `Booked ${data?.outlet?.outletName} for ${moment(
        data?.reservationDate
      ).format("dddd, D MMMM")}, 
                ${convertTime(data?.reservationTime)}.`,
      url: window.location.href,
    });
  };

  const handleCopy = () => {
    copy(window.location.href);
    setCopied(true);
  };

  const getDataMenuPdf = async () => {
    const res = await bookingService.getMenuPdf(data?.outlet?.brandId);
    if (typeof res !== "string") setMenuPdf(res);
  };

  useEffect(() => {
    if (data?.id) getDataMenuPdf();
  }, [data]);

  return (
    <div className="reservation-confirmed">
      <div className="main-content">
        <div className="body">
          <div className="info-reserve">
            <IconConfirm className="mb-12" />
            <h1 className="fs-26 fw-700 mb-8">Reservation Confirmed</h1>
            <p className="fs-16 mb-24 color-51">
              An email has been sent to {data?.user?.email}
            </p>
            <p className="fs-18 fw-700 pb-20 border-bottom-d6d6d6">
              {data?.outlet?.outletName}
            </p>
            <InfoReserveDetail dataReserve={data} />
            {data?.notes && (
              <div className="pt-20 pb-20 border-bottom-d6d6d6">
                <p className="fs-16 mb-10">Special Requests</p>
                <p className="fs-14 color-51">“{data?.notes}”</p>
              </div>
            )}

            <div className="pt-20 pb-20 border-bottom-d6d6d6">
              <div className="mb-10">
                {!breakpointUp(800) ? (
                  <>
                    <CustomButtonNew
                      type="primary"
                      text="Share This Page"
                      onClick={handleClickOpen}
                    />
                  </>
                ) : (
                  <>
                    <div className="pb-10 pt-10">
                      <span className="fs-16">Share this Reservation</span>
                    </div>
                    <div className="copy-url">
                      <MyOutlinedInput
                        disabled
                        variant="outlined"
                        value={window.location.href}
                      />
                      <div>
                        <CustomButtonNew
                          type={copied ? "success" : "primary"}
                          text={copied ? "COPIED!" : "Copy URL"}
                          onClick={handleCopy}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <span
                className="cancel-reservation"
                role="button"
                tabIndex={0}
                onClick={() => setShowCancelDialog(true)}
                onKeyPress={() => {}}
              >
                Cancel Reservation
              </span>
            </div>
          </div>
          <div className="policies border-bottom-d6d6d6">
            <h5 className="fs-16 mb-20">Restaurant Policies</h5>
            <div className="list-policies">
              {policies && <ul>{policies}</ul>}
            </div>
          </div>
          {dataGuest?.email && (
            <div className="pb-20 pt-20 border-bottom-d6d6d6">
              <CreateAsGuest />
            </div>
          )}
          {!_.isEmpty(menuPdf) && (
            <div className="checkout-menu pb-20 pt-20 border-bottom-d6d6d6">
              <h5 className="fs-16 mb-20">Check out our Menu</h5>
              {menuPdf?.map(e => (
                <div className="mb-5" key={e?.id}>
                  <CustomButtonNew
                    text={e?.name}
                    onClick={() => window.open(e?.fileLink, "_blank")}
                    endIcon={<IconLink />}
                  />
                </div>
              ))}
            </div>
          )}
          <div>
            <h5 className="fs-16 mt-20">Plan Your Journey</h5>
            <MapConfirmReserve dataOutlet={data?.outlet} />
          </div>
          <div>
            <InfoOutlet dataOutlet={data?.outlet} />
          </div>
        </div>
      </div>
      <style jsx>{`
        .reservation-confirmed {
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          .main-content {
            z-index: 1;
            max-width: 414px;
            width: 100%;
            .body {
              padding: 20px 16px;
              text-align: center;
              border: 1px solid #d6d6d6;
              border-radius: 6px;
              background-color: white;
              color: black;
              .info-reserve {
                .copy-url {
                  display: flex;
                  justify-content: space-between;
                  :global(.MuiButton-root) {
                    height: 52px;
                    width: 132px;
                  }
                  :global(.MuiFormControl-root) {
                    width: 240px;
                  }
                }
                .cancel-reservation {
                  color: #d62105;
                  text-decoration: underline;
                  cursor: pointer;
                }
              }
            }
            .policies {
              padding: 20px 0;
              .list-policies {
                padding: 16px 10px;
                border: 1px solid #d6d6d6;
                ul {
                  max-height: 280px;
                  overflow-y: auto;
                  list-style: "・";
                  text-align: left;
                }
              }
            }
          }
        }
      `}</style>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ReservationConfirmed), {
  ssr: false,
});
