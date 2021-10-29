import React from "react";
import moment from "moment";
import router from "next/router";
import { IconCalendar, IconClock, IconPeople, IconPin } from "@/assets/img";
import {
  BookingStoreProp,
  IDataBookingStore,
  useBookingStore,
  useDataBookingStore,
} from "@/store/store";
import CustomButtonNew from "@/components/Button/CustomButton";
import { convertTime } from "@/common/ultil/convertTime";

interface IProps {
  isModify?: boolean;
}

function InfoReserve(props: IProps): JSX.Element {
  const { isModify } = props;

  const outlet = useBookingStore((state: BookingStoreProp) => state.outlet);

  const time = useBookingStore((state: BookingStoreProp) => state.time);
  const numAdults = useBookingStore(
    (state: BookingStoreProp) => state.numAdults
  );
  const numChild = useBookingStore((state: BookingStoreProp) => state.numChild);
  const dataBooking = useDataBookingStore(
    (state: IDataBookingStore) => state.dataBooking
  );

  return (
    <div className="info-reserve">
      <h5 className="fs-16">{outlet?.outlet}</h5>
      <div className="address info-reserve-detail fs-14">
        <IconPin className="mr-8" />
        <span>{outlet?.address}</span>
      </div>
      <div className="fs-14">
        <div className="info-reserve-detail">
          <IconPeople className="mr-8" />
          <span>{numAdults} Adults</span>
          {numChild > 0 && <span>, {numChild} Children</span>}
        </div>
        <div className="info-reserve-detail">
          <IconCalendar className="mr-8" />
          <span>
            {moment(dataBooking?.reservationDate).format("dddd, D MMMM")},{" "}
            {time.label}
          </span>
        </div>
        <div className="info-reserve-detail">
          <IconClock className="mr-8" />
          <span>{convertTime(dataBooking?.reservationTime)}</span>
        </div>
      </div>
      {isModify && (
        <div className="mt-3">
          <CustomButtonNew
            type="secondary"
            text="Modify"
            onClick={() => router.back()}
          />
        </div>
      )}
      <style jsx>{`
        .info-reserve {
          color: black;
          h5 {
            margin-top: 20px;
            margin-bottom: 10px;
          }
          .address {
            padding-bottom: 20px;
            border-bottom: 1px solid #d6d6d6;
          }
          .info-reserve-detail {
            display: flex;
            margin-bottom: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default InfoReserve;
