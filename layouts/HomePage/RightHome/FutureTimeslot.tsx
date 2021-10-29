import React from "react";
import moment from "moment";
import { find } from "lodash";
import { convertTime } from "@/common/ultil/convertTime";
import ButtonAccordion from "@/components/Accordion";
import { IDataBooking, TimeProp } from "@/store/store";
import InlineNotification from "@/components/InlineNotification";
import ContentAccordion from "./ContentAccordion";
import { dateAfterNDays, dayOfWeek } from "./tool";

interface IProps {
  list5time: {
    now: Array<TimeProp>;
    afterOneDay: Array<TimeProp>;
    afterTwoDay: Array<TimeProp>;
    afterThreeDay: Array<TimeProp>;
  };
  timeSlotSelected: string;
  dataBooking: IDataBooking;
  setDataBooking: (dataBooking: IDataBooking) => void;
  date: string;
  outletIdItem: string;
  defaultExpanded?: boolean;
  listBlockedDate: Array<{ date: string; blockedReason: string }>;
}
function FutureTimeslot({
  list5time,
  timeSlotSelected,
  dataBooking,
  setDataBooking,
  date,
  outletIdItem,
  defaultExpanded = false,
  listBlockedDate,
}: IProps): JSX.Element {
  const generateNotify = (listime: TimeProp[], _date: string): string => {
    let rs = "";
    // todo
    const compare = find(
      listBlockedDate,
      e => e.date === moment(_date, '"YYYY-MM-DD"').format("D")
    );
    const listRs: { [key: string]: string } = {
      BLOCK: "Sorry! Restaurant does not accept reservations on this day.",
      NO_AVAILABLE: "Sorry! Restaurant is fully booked on this day.",
      NO_SETTING: "Sorry! Restaurant does not accept reservations on this day.",
    };
    if (compare) {
      return listRs[compare.blockedReason];
    }
    const startTime = moment(timeSlotSelected, "HH:mm:ss")
      .add(-2.5, "hours")
      .format("hh:mm A");
    const endTime = moment(timeSlotSelected, "HH:mm:ss")
      .add(2.5, "hours")
      .format("hh:mm A");
    if (listime?.length < 5 && listime?.length > 0) {
      rs = `Only ${listime?.length} timeslots left between ${startTime} to ${endTime}`;
    }
    if (listime?.length === 0) {
      rs = `Sorry! No available timeslots left between ${startTime} to ${endTime}.`;
    }
    return rs;
  };

  return (
    <>
      <div className="future">
        <ButtonAccordion
          defaultExpanded={defaultExpanded}
          title={`Future availability around ${convertTime(timeSlotSelected)}`}
        >
          <div className="accordion-content">
            <ContentAccordion
              dataBooking={dataBooking}
              setDataBooking={setDataBooking}
              label={dayOfWeek(dateAfterNDays(1, date))}
              listTime={list5time?.afterOneDay}
              date={dateAfterNDays(1, date)}
              outletIdItem={outletIdItem}
            />
            {list5time?.afterOneDay?.length === 0 && (
              <InlineNotification
                content={generateNotify(
                  list5time?.afterOneDay,
                  dateAfterNDays(1, date)
                )}
                isBg={false}
              />
            )}

            <ContentAccordion
              dataBooking={dataBooking}
              setDataBooking={setDataBooking}
              label={dayOfWeek(dateAfterNDays(2, date))}
              listTime={list5time?.afterTwoDay}
              date={dateAfterNDays(2, date)}
              outletIdItem={outletIdItem}
            />
            {list5time?.afterTwoDay?.length === 0 && (
              <InlineNotification
                content={generateNotify(
                  list5time?.afterTwoDay,
                  dateAfterNDays(2, date)
                )}
                isBg={false}
              />
            )}

            <ContentAccordion
              dataBooking={dataBooking}
              setDataBooking={setDataBooking}
              label={dayOfWeek(dateAfterNDays(3, date))}
              listTime={list5time?.afterThreeDay}
              date={dateAfterNDays(3, date)}
              outletIdItem={outletIdItem}
            />
            {list5time?.afterThreeDay?.length === 0 && (
              <InlineNotification
                content={generateNotify(
                  list5time?.afterThreeDay,
                  dateAfterNDays(3, date)
                )}
                isBg={false}
              />
            )}
          </div>
        </ButtonAccordion>
      </div>
      <style jsx>
        {`
          .future {
            :global(.custom-chip) {
              margin: 10px 0;
            }
          }
        `}
      </style>
    </>
  );
}

export default FutureTimeslot;
