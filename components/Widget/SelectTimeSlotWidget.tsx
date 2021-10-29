import React, { useEffect, useState } from "react";
import moment from "moment";
import { CustomMenuItem } from "@/components/Select";
import CustomSelectNew from "@/components/Select/CustomSelectNew";
import { BookingStoreProp, useBookingStore } from "@/store/store";
import { generateListTime, IListTimeSlot } from "@/common/ultil/myTool";

interface IProps {
  defaultDate?: string;
  defaultTimeSlot?: string;
  setTimeSlot: (arg0: string) => void;
}

function SelectTimeSlotWidget(props: IProps): JSX.Element {
  const { defaultDate, defaultTimeSlot, setTimeSlot } = props;
  // store

  const date = useBookingStore((state: BookingStoreProp) => state.date);
  const setDate = useBookingStore((state: BookingStoreProp) => state.setDate);

  // state
  const [isUsed, setIsUsed] = useState(false);
  const listRootTimeSlotDropDown = generateListTime();
  const [listTimeSlotDropDown, setListTimeSlotDropDown] = useState<
    IListTimeSlot[]
  >(listRootTimeSlotDropDown);
  const [timeSlotSelected, setTimeSlotSelected] = useState<string>();

  const handleSetTimeSlot = (timeslot: string) => {
    setTimeSlotSelected(timeslot);
  };

  useEffect(() => {
    if (moment().format("YYYY-MM-DD") === date) {
      const temp = listTimeSlotDropDown?.filter(
        x => moment().diff(moment(x.value, "hh:mm:ss")) <= 0
      );
      if (temp.length > 0) {
        setListTimeSlotDropDown(temp);
        if (
          !defaultTimeSlot ||
          (defaultDate && moment().format("DDMMYYYY") !== defaultDate)
        ) {
          if (
            moment().isBetween(
              moment("00:00:00", "hh:mm:ss"),
              moment("11:59:59", "hh:mm:ss")
            )
          ) {
            setTimeSlotSelected("12:00:00");
            return;
          }
          if (
            moment().isBetween(
              moment("14:00:00", "hh:mm:ss"),
              moment("18:59:59", "hh:mm:ss")
            )
          ) {
            setTimeSlotSelected("19:00:00");
            return;
          }
          if (
            moment().isBetween(
              moment("23:00:00", "hh:mm:ss"),
              moment("23:59:59", "hh:mm:ss")
            )
          ) {
            setDate(moment().add("days", 1).format("YYYY-MM-DD"));
            setTimeSlotSelected("12:00:00");
            return;
          }
          setTimeSlotSelected(temp[0]?.value);
          return;
        }
        if (!isUsed) {
          const tempTime = moment(defaultTimeSlot, "hhmm").format("HH:mm:ss");
          const findTime = temp.find(item => item?.value === tempTime);
          if (findTime) {
            setTimeSlotSelected(tempTime);
            setIsUsed(true);
          } else {
            if (
              (defaultDate && moment().format("DDMMYYYY") === defaultDate) ||
              !defaultDate
            ) {
              setIsUsed(true);
            }
            setTimeSlotSelected(temp[0]?.value);
          }
          return;
        }
        setTimeSlotSelected(temp[0]?.value);
      }
    } else {
      setListTimeSlotDropDown(listRootTimeSlotDropDown);
      if (!defaultTimeSlot) {
        setTimeSlotSelected(listRootTimeSlotDropDown[0]?.value);
        return;
      }
      if (!isUsed) {
        const tempTime = moment(defaultTimeSlot, "hhmm").format("HH:mm:ss");
        const findTime = listRootTimeSlotDropDown.find(
          item => item?.value === tempTime
        );
        if (findTime) {
          setTimeSlotSelected(tempTime);
          setIsUsed(true);
        } else {
          setTimeSlotSelected(listRootTimeSlotDropDown[0]?.value);
        }
        return;
      }
      setTimeSlotSelected(listRootTimeSlotDropDown[0]?.value);
    }
  }, [date]);

  useEffect(() => {
    if (timeSlotSelected) {
      setTimeSlot(timeSlotSelected);
    }
  }, [timeSlotSelected]);

  return (
    <>
      <div className="form-item">
        <CustomSelectNew
          value={timeSlotSelected}
          onChange={handleSetTimeSlot}
          label="Timeslot"
        >
          {listTimeSlotDropDown.map(e => (
            <CustomMenuItem value={e.value} key={e.value}>
              {e.label}
            </CustomMenuItem>
          ))}
        </CustomSelectNew>
      </div>
    </>
  );
}

export default SelectTimeSlotWidget;
