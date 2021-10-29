import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { find } from "lodash";
import WigetContext from "@/common/context/WigetContext";
import { WidgetAction, WidgetType } from "@/common/constant/Widget";
import {
  BookingStoreProp,
  OutletProp,
  useBookingStore,
  UseBrandProp,
  useBrandStore,
} from "@/store/store";
import CustomButtonNew from "@/components/Button/CustomButton";
import bookingService from "@/services/booking.service";
import InputSelectNumDiners from "@/layouts/HomePage/RightHome/InputSelectNumDiners";
import SelectTimeSlotWidget from "@/components/Widget/SelectTimeSlotWidget";
import DatePickerWidget from "@/components/Widget/DatePickerWidget";
import { IOutletResponse } from "@/common/interface";
import SelectOutlet from "@/components/Select/SelectOutlet";

export default function Widget(): JSX.Element {
  const { widgetConfig } = useContext(WigetContext);
  const { type, outletId, brandShortName, modalId, token } = widgetConfig;

  // store zustand
  const numAdults = useBookingStore(
    (state: BookingStoreProp) => state.numAdults
  );

  const setNumAdults = useBookingStore(
    (state: BookingStoreProp) => state.setNumAdults
  );

  const numChild = useBookingStore((state: BookingStoreProp) => state.numChild);

  const setNumChild = useBookingStore(
    (state: BookingStoreProp) => state.setNumChild
  );

  const date = useBookingStore((state: BookingStoreProp) => state.date);
  const setDate = useBookingStore((state: BookingStoreProp) => state.setDate);

  const brand = useBrandStore((state: UseBrandProp) => state.brand);
  const setBrand = useBrandStore((state: UseBrandProp) => state.setBrand);

  const outlet = useBookingStore((state: BookingStoreProp) => state.outlet);
  const setOutlet = useBookingStore(
    (state: BookingStoreProp) => state.setOutlet
  );

  // state

  const [timeSlot, setTimeSlot] = useState("");
  const [listOutlet, setListOutlet] = useState<Array<OutletProp>>([]);

  const getDetailOutletInfo = async () => {
    const res = await bookingService.getListOutlet(brandShortName as string);

    if (typeof res !== "string" && res?.outlets) {
      setBrand({
        name: res?.brandName,
        logo: res?.brandLogo,
        cover: res?.brandCoverImage,
        shortName: res?.brandShortName,
        id: res?.id,
        occasions: res?.occasions,
        countryCode: res?.countryCode,
      });
      if (outletId) {
        const tmpOutlet = res?.outlets.find(value => value.id === outletId);
        if (typeof tmpOutlet !== "undefined") {
          const currentOutletInfo = {
            outlet: tmpOutlet?.outletName,
            address: tmpOutlet?.outletAddress,
            id: tmpOutlet?.id,
            maxPax: Number(tmpOutlet?.maxPaxPerReservation),
            logo: tmpOutlet?.outletLogo,
            email: tmpOutlet?.email,
            phone: tmpOutlet?.phone,
            operationHours: tmpOutlet?.operationHours,
            reservationDiningInterval: tmpOutlet?.reservationDiningInterval,
            reservationPolicy: tmpOutlet?.reservationPolicy,
            directionLink: tmpOutlet?.directionLink,
          };

          setOutlet(currentOutletInfo);
        }
      } else if (!outletId && res?.outlets) {
        setListOutlet(
          res?.outlets.map((e: IOutletResponse) => ({
            outlet: e?.outletName,
            address: e?.outletAddress,
            id: e?.id,
            maxPax: Number(e?.maxPaxPerReservation),
            logo: e?.outletLogo,
            email: e?.email,
            phone: e?.phone,
            operationHours: e?.operationHours,
            reservationDiningInterval: e?.reservationDiningInterval,
            reservationPolicy: e?.reservationPolicy,
            directionLink: e?.directionLink,
          }))
        );
        setOutlet({
          outlet: res?.outlets[0]?.outletName,
          address: res?.outlets[0]?.outletAddress,
          id: res?.outlets[0]?.id,
          maxPax: Number(res?.outlets[0]?.maxPaxPerReservation),
          logo: res?.outlets[0]?.outletLogo,
          email: res?.outlets[0]?.email,
          phone: res?.outlets[0]?.phone,
          operationHours: res?.outlets[0]?.operationHours,
          reservationDiningInterval: res?.outlets[0]?.reservationDiningInterval,
          reservationPolicy: res?.outlets[0]?.reservationPolicy,
          directionLink: res?.outlets[0]?.directionLink,
        });
      }
    }
  };

  const handleSelectOutlet = (idOutlet: string) => {
    const temp = find(listOutlet, { id: idOutlet });
    if (temp) {
      setOutlet(temp);
    }
  };

  const handleFindAvaiableTable = () => {
    const postMessageData = {
      action: WidgetAction.FIND_TABLE,
      widgetInfo: {
        brand,
        time: timeSlot,
        numAdults,
        numChild,
        outlet,
        date,
        isUsingIframe: true,
        modalId,
        token,
      },
    };

    // Pass data from Iframe into window parent
    window.parent.postMessage(JSON.stringify(postMessageData), "*");
  };

  useEffect(() => {
    if (brandShortName) {
      getDetailOutletInfo();
      localStorage.setItem("brandShortName", brandShortName);
    }
    if (WidgetType.BUTTON === type) {
      const a = document.getElementsByTagName("body");
      a[0].style.backgroundColor = "transparent";
    }
    if (widgetConfig.adult) {
      setNumAdults(Number(widgetConfig.adult));
    }

    if (widgetConfig.child) {
      setNumChild(Number(widgetConfig.child));
    }

    if (widgetConfig.date) {
      const tempDate = moment(widgetConfig.date, "DDMMYYYY").format(
        "YYYY-MM-DD"
      );
      if (moment(tempDate).diff(moment(), "days") >= 0) {
        setDate(tempDate);
      }
    }

    if (widgetConfig?.timeslot && WidgetType.BUTTON === type && outletId) {
      setTimeSlot(moment(widgetConfig?.timeslot, "hhmm").format("HH:mm:ss"));
    }
  }, [widgetConfig]);

  return (
    <div className="widget-standard-container">
      {WidgetType.BUTTON === type && (
        <>
          <div className="mb-20">
            <CustomButtonNew
              type="primary"
              text="Find a Table"
              onClick={handleFindAvaiableTable}
            />
          </div>
          <div className="div-center">
            <span className="power-oddle">
              Powered by{" "}
              <strong>
                <a
                  target="_blank"
                  href="https://oddle.vip/UrL"
                  rel="noreferrer"
                >
                  Oddle
                </a>
              </strong>
            </span>
          </div>
        </>
      )}

      {WidgetType.STANDARD === type && (
        <>
          <div className="div-center mb-25">
            <h6 className="fs-26 fw-700 font-arsenal">Make a Reservation</h6>
          </div>

          {!outletId && (
            <div className="mb-25">
              <SelectOutlet
                listOption={listOutlet}
                label="Outlet"
                onChange={handleSelectOutlet}
                defaultValue={outlet?.id}
              />
            </div>
          )}

          <div className="mb-25">
            <InputSelectNumDiners
              maxPax={10}
              defaultAdult={
                widgetConfig?.adult ? Number(widgetConfig?.adult) : 2
              }
              defaultChild={
                widgetConfig?.child ? Number(widgetConfig?.child) : 0
              }
            />
          </div>

          <div className="mb-25">
            <DatePickerWidget />
          </div>

          <div className="mb-16">
            <SelectTimeSlotWidget
              defaultDate={widgetConfig?.date && widgetConfig.date}
              defaultTimeSlot={widgetConfig?.timeslot && widgetConfig?.timeslot}
              setTimeSlot={setTimeSlot}
            />
          </div>

          <div className="mb-20">
            <CustomButtonNew
              type="primary"
              text="Find a Table"
              onClick={handleFindAvaiableTable}
            />
          </div>

          <div className="div-center">
            <span className="power-oddle">
              Powered by{" "}
              <strong>
                <a
                  target="_blank"
                  href="https://oddle.vip/UrL"
                  rel="noreferrer"
                >
                  Oddle
                </a>
              </strong>
            </span>
          </div>
        </>
      )}

      <style jsx>{`
        .widget-standard-container {
          box-shadow: ${WidgetType.STANDARD === type
            ? "0px 0px 10px rgba(0, 0, 0, 0.15)"
            : "unset"};
          box-sizing: border-box;
          padding: 16px;
        }
        .power-oddle {
          color: #959595;
          a {
            cursor: pointer;
            color: #959595;
          }
        }
      `}</style>
    </div>
  );
}
