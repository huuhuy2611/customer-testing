import React from "react";
import { ListTimeProp } from "@/common/ultil/convertListTime";
import ButtonAccordion from "@/components/Accordion";
import InlineNotification from "@/components/InlineNotification";
import { IDataBooking, useBookingStore } from "@/store/store";
import ContentAccordion from "./ContentAccordion";
import { dayOfWeekOtherTimslot } from "./tool";

interface IProps {
  listTime: ListTimeProp[];
  dataBooking: IDataBooking;
  setDataBooking: (dataBooking: IDataBooking) => void;
  defaultExpanded?: boolean;
}

function OtherTimeSlotToday({
  listTime,
  dataBooking,
  setDataBooking,
  defaultExpanded = false,
}: IProps): JSX.Element {
  const date = useBookingStore(state => state.date);
  const outlet = useBookingStore(state => state.outlet);

  return (
    <>
      <ButtonAccordion
        title={`Other timeslots ${dayOfWeekOtherTimslot(date)}`}
        defaultExpanded={defaultExpanded}
      >
        <div className="accordion-content">
          {listTime
            .sort((timeSlot1, timeSlot2) => {
              if (
                !(
                  timeSlot1?.options?.length > 0 &&
                  timeSlot2?.options?.length > 0
                )
              ) {
                if (timeSlot1?.options?.length > 0) return 1;
                if (timeSlot2?.options?.length > 0) return 0;
                return 1;
              }
              return timeSlot1?.options[0]?.value.localeCompare(
                timeSlot2?.options[0]?.value
              );
            })
            ?.map(e => (
              <div key={e?.id}>
                {e?.options?.length > 0 ? (
                  <ContentAccordion
                    date={date}
                    outletIdItem={outlet?.id}
                    label={e?.label}
                    listTime={e?.options}
                    dataBooking={dataBooking}
                    setDataBooking={setDataBooking}
                  />
                ) : (
                  <div className="content">
                    <div className="label">{e?.label}</div>
                    <InlineNotification
                      content="No available timeslots left"
                      isBg={false}
                    />
                    <style jsx>
                      {`
                        .content {
                          margin-bottom: 20px;
                          .label {
                            font-weight: 500;
                            font-size: 16px;
                            line-height: 20px;
                            color: #000000;
                            margin-bottom: 10px;
                            text-transform: capitalize;
                          }
                        }
                        .content:nth-last-child(1) {
                          margin-bottom: 13px;
                        }
                      `}
                    </style>
                  </div>
                )}
              </div>
            ))}
        </div>
      </ButtonAccordion>
    </>
  );
}

export default OtherTimeSlotToday;
