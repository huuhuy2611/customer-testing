import React, { useEffect, useState } from "react";
import { find } from "lodash";
import ButtonAccordion from "@/components/Accordion";
import bookingService from "@/services/booking.service";
import {
  BookingStoreProp,
  IDataBooking,
  OutletProp,
  TimeProp,
  useBookingStore,
} from "@/store/store";
import ContentAccordion from "./ContentAccordion";
import { renderListOption } from "./tool";

interface IOutletTimeslot {
  id: string;
  name: string;
  listTimeSlot: TimeProp[];
}
interface IProps {
  listOutlet: OutletProp[];
  dataBooking: IDataBooking;
  setDataBooking: (dataBooking: IDataBooking) => void;
  timeSlotSelected: string;
}

function OtherOutletTimeSlot({
  listOutlet,
  dataBooking,
  setDataBooking,
  timeSlotSelected,
}: IProps): JSX.Element {
  // store
  const outlet = useBookingStore((state: BookingStoreProp) => state.outlet);

  const date = useBookingStore((state: BookingStoreProp) => state.date);

  const numAdults = useBookingStore(
    (state: BookingStoreProp) => state.numAdults
  );
  const numChild = useBookingStore((state: BookingStoreProp) => state.numChild);

  const [listOutletTimeSlot, setListOutletTimeSlot] = useState<
    Array<IOutletTimeslot>
  >([]);

  const find5NearlestTimeslot = (listOptionInput: TimeProp[]): TimeProp[] => {
    let temp: TimeProp[] = [];
    const id = listOptionInput.findIndex(e => e.value === timeSlotSelected);

    if (id === 0 || id === 1) temp = listOptionInput.slice(0, 5);
    else temp = listOptionInput.slice(id - 2, id + 3);
    return temp;
  };

  const fetchDataListTime = async () => {
    const temp: IOutletTimeslot[] = [];
    await Promise.all(
      listOutlet?.map(async e => {
        if (e?.id !== outlet?.id) {
          const res = await bookingService.getListTime(
            e?.id,
            date,
            numAdults + numChild
          );

          if (typeof res !== "string" && res[0]?.id) {
            const listTimeSlot = renderListOption(res, date);
            if (listTimeSlot.length > 0) {
              temp.push({
                id: e?.id,
                listTimeSlot: find5NearlestTimeslot(listTimeSlot),
                name: find(listOutlet, { id: e?.id })?.outlet as string,
              });
            }
          }
        }
      })
    );

    setListOutletTimeSlot(temp);
  };

  useEffect(() => {
    if (outlet?.id) fetchDataListTime();
  }, [listOutlet, timeSlotSelected, outlet?.id, date, numAdults + numChild]);

  return (
    <>
      {listOutletTimeSlot?.some(e => e.listTimeSlot.length > 0) && (
        <div className="form-item">
          <ButtonAccordion title="Availability at other outlets">
            <div className="accordion-content">
              {listOutletTimeSlot?.map(e => (
                <div key={e?.id}>
                  {e?.listTimeSlot.length > 0 && (
                    <ContentAccordion
                      key={e?.id}
                      date={date}
                      outletIdItem={e?.id}
                      label={e?.name}
                      listTime={e?.listTimeSlot}
                      dataBooking={dataBooking}
                      setDataBooking={setDataBooking}
                    />
                  )}
                </div>
              ))}
            </div>
          </ButtonAccordion>
        </div>
      )}
    </>
  );
}

export default OtherOutletTimeSlot;
