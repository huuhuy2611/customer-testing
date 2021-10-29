import React from "react";
import { Grid } from "@material-ui/core";
import ButtonTime from "@/components/Button/ButtonTime/ButtonTime";
import {
  BookingStoreProp,
  IDataBooking,
  TimeProp,
  useBookingStore,
} from "@/store/store";

interface IProps {
  label?: string;
  listTime: TimeProp[];
  date: string;
  outletIdItem: string;
  dataBooking: IDataBooking;
  setDataBooking: (dataBooking: IDataBooking) => void;
}
function ContentAccordion(props: IProps): JSX.Element {
  const { label, listTime, date, outletIdItem, dataBooking, setDataBooking } =
    props;

  const setTime = useBookingStore((state: BookingStoreProp) => state.setTime);

  const handleClick = (timeInput: TimeProp) => {
    setTime(timeInput);
    setDataBooking({
      reservationTime: timeInput?.value as string,
      reservationDate: date,
      outletId: outletIdItem,
      serviceTimingId: timeInput?.id as string,
    });
  };

  return (
    <div className="content">
      {label && <div className="label">{label}</div>}{" "}
      <Grid container spacing={1}>
        {listTime?.map(e => (
          <Grid item xs={4} key={`${e?.value as string}-${e?.id as string}`}>
            <ButtonTime
              status={
                e?.id === dataBooking.serviceTimingId &&
                e?.value === dataBooking?.reservationTime &&
                date === dataBooking?.reservationDate &&
                outletIdItem === dataBooking?.outletId
                  ? "active"
                  : "default"
              }
              time={e.value as string}
              value={e.value as string}
              onClick={() => handleClick(e)}
            />
          </Grid>
        ))}
      </Grid>
      <style jsx>
        {`
          .content {
            margin-bottom: ${listTime?.length > 0 ? "20px" : ""};
            .label {
              font-weight: 500;
              font-size: 16px;
              line-height: 20px;
              color: #000000;
              margin-bottom: 10px;
              text-transform: capitalize;
            }
          }
        `}
      </style>
    </div>
  );
}

export default ContentAccordion;
