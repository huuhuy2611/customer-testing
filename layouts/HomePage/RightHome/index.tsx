import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { find } from "lodash";
import moment from "moment";
import bookingService from "@/services/booking.service";
import {
  OutletProp,
  useBookingStore,
  useBrandStore,
  useDataBookingStore,
} from "@/store/store";
import { IOutletResponse } from "@/common/interface";
import SelectOutlet from "@/components/Select/SelectOutlet";
import InputSelectNumDiners from "@/layouts/HomePage/RightHome/InputSelectNumDiners";
import CustomButtonNew from "@/components/Button/CustomButton";
import Datepicker from "@/components/Datepicker";
import { breakpointUp } from "@/common/ultil/myTool";
import { BlockReason } from "@/common/constant/Enum";
import StepLabel from "../../StepLabel";
import Header from "../../Header";
import SelectTimeSlot from "./SelectTimeSlot";

function RightHome({
  isAvailableOutlet,
  defaultTime,
  defaultDate,
}: {
  isAvailableOutlet: boolean;
  defaultTime?: string;
  defaultDate?: string;
}): JSX.Element {
  const router = useRouter();
  const brandShortName = router.query.branch;

  // state
  const [listOutlet, setListOutlet] = useState<Array<OutletProp>>([]);
  const [listBlockedDate, setListBlockedDate] = useState<
    Array<{ date: string; blockedReason: string }>
  >([]);
  const [monthDatePicker, setMonthDatePicker] = useState<string>(
    moment().format("yyyy-MM")
  );

  // store
  const date = useBookingStore(state => state.date);
  const setDate = useBookingStore(state => state.setDate);
  const numAdults = useBookingStore(state => state.numAdults);
  const numChild = useBookingStore(state => state.numChild);
  const outlet = useBookingStore(state => state.outlet);
  const setOutlet = useBookingStore(state => state.setOutlet);
  const setBrand = useBrandStore(state => state.setBrand);
  const dataBooking = useDataBookingStore(state => state.dataBooking);

  const fetchDataListOutlet = async () => {
    const res = await bookingService.getListOutlet(brandShortName as string);
    if (typeof res !== "string") {
      setBrand({
        name: res?.brandName,
        logo: res?.brandLogo,
        cover: res?.brandCoverImage,
        shortName: res?.brandShortName,
        id: res?.id,
        occasions: res?.occasions,
        countryCode: res?.countryCode,
      });
      if (res?.outlets) {
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
        if (
          router.query?.outletId &&
          res.outlets.find(
            (item: IOutletResponse) => item?.id === router.query.outletId
          )
        ) {
          return;
        }
        if (isAvailableOutlet) return;
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

  const getListBlockedDate = async () => {
    if (outlet?.id) {
      const res = await bookingService.getBlockOutDate(
        outlet.id,
        numAdults + numChild,
        monthDatePicker
      );

      if (typeof res !== "string") {
        const resNotNull =
          res?.filter(e => typeof e.blockedReason === "string") || [];
        const temp = resNotNull?.map(e => {
          let blockedReason = "";
          if (e.blockedReason === BlockReason.BLOCK) blockedReason = "BLOCK";
          if (e.blockedReason === BlockReason.NO_AVAILABLE)
            blockedReason = "NO_AVAILABLE";
          if (e.blockedReason === BlockReason.NO_SETTING)
            blockedReason = "NO_SETTING";
          return {
            date: e?.date?.split("-")[2],
            blockedReason,
          };
        });
        setListBlockedDate(temp);
      }
    }
  };

  const handleNext = () => {
    if (dataBooking?.outletId) {
      const tempFindOutlet = find(
        listOutlet,
        item => item?.id === dataBooking?.outletId
      );
      if (tempFindOutlet) {
        setOutlet(tempFindOutlet);
      }
    }
    router.push(`/${brandShortName as string}/contact`);
  };

  useEffect(() => {
    if (brandShortName) {
      fetchDataListOutlet();
      localStorage.setItem("brandShortName", brandShortName as string);
    }
  }, [brandShortName]);

  useEffect(() => {
    if (router.query?.reserveError) {
      // setReserveError(true);
    }
  }, [router.query?.reserveError]);

  useEffect(() => {
    if (outlet?.id) getListBlockedDate();
  }, [outlet?.id, monthDatePicker, numAdults + numChild]);

  useEffect(() => {
    router.prefetch(`/${brandShortName as string}/contact`);
    getListBlockedDate();
  }, []);

  useEffect(() => {
    if (router.query.date) {
      const tempDate = moment(router.query.date, "DDMMYYYY").format(
        "YYYY-MM-DD"
      );
      if (moment(tempDate).diff(moment(), "days") >= 0) setDate(tempDate);
    }
  }, [router.query.date]);

  return (
    <>
      <div className="right-home">
        {!breakpointUp(800) && <Header mobile />}
        <div className="form">
          <StepLabel step={1} />
          {listOutlet?.length > 1 && (
            <div className="form-item">
              <SelectOutlet
                listOption={listOutlet}
                label="Outlet"
                onChange={handleSelectOutlet}
                defaultValue={outlet?.id}
              />
            </div>
          )}
          <div className="form-item select-numdiner">
            <InputSelectNumDiners
              maxPax={10}
              defaultAdult={numAdults}
              defaultChild={numChild}
            />
          </div>
          <div className="form-item">
            <Datepicker
              defaultDate={date}
              setMonthDatePicker={setMonthDatePicker}
              listDateBlur={listBlockedDate.map(e => e.date)}
            />
          </div>
          <div className="form-item select-timeslot">
            <SelectTimeSlot
              listOutlet={listOutlet}
              defaultTimeSlot={defaultTime}
              defaultDate={defaultDate as string}
              listBlockedDate={listBlockedDate}
            />
          </div>
          <div>
            <CustomButtonNew
              disabled={!dataBooking.reservationTime}
              text="Next"
              onClick={handleNext}
              type="primary"
            />
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .right-home {
            width: 375px;
            display: block;
            margin: 0 auto;
            @media (max-width: 375px) {
              width: 100%;
            }
            .divider {
              background: linear-gradient(
                90deg,
                #c4c4c4 0%,
                rgba(196, 196, 196, 0) 54.2%
              );
              opacity: 0.15;
              transform: matrix(0, 1, 1, 0, 0, 0);
              width: 20px;
              height: 200vw;
              position: absolute;
              top: -255px;
              left: 0;
            }
            .form {
              padding: 0 16px 20px;
              @media screen and (min-width: 800px) {
                padding: 0 0 20px;
              }
              :global(.form-item) {
                margin-bottom: 30px;
              }
            }
          }
        `}
      </style>
    </>
  );
}

export default RightHome;
