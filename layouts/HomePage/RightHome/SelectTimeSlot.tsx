import moment from "moment";
import React, { useEffect, useState } from "react";
import { find } from "lodash";
import { useRouter } from "next/router";
import { CustomMenuItem } from "@/components/Select";
import CustomSelectNew from "@/components/Select/CustomSelectNew";
import bookingService from "@/services/booking.service";
import {
  OutletProp,
  TimeProp,
  useBookingStore,
  useDataBookingStore,
} from "@/store/store";
import { generateListTime, IListTimeSlot } from "@/common/ultil/myTool";
import InlineNotification from "@/components/InlineNotification";
import { convertListTime, ListTimeProp } from "@/common/ultil/convertListTime";
import ContentAccordion from "./ContentAccordion";
import OtherOutletTimeSlot from "./OtherOutletTimeSlot";
import {
  dateAfterNDays,
  generateListTimeAroundPreferredTime,
  renderListOption,
} from "./tool";
import OtherTimeSlotToday from "./OtherTimeSlotToday";
import FutureTimeslot from "./FutureTimeslot";

interface IProps {
  listOutlet: OutletProp[];
  defaultTimeSlot?: string;
  listBlockedDate: Array<{ date: string; blockedReason: string }>;
  defaultDate: string;
}

function SelectTimeSlot({
  listOutlet,
  defaultTimeSlot,
  listBlockedDate,
  defaultDate,
}: IProps): JSX.Element {
  const router = useRouter();

  // store
  const outlet = useBookingStore(state => state.outlet);
  const date = useBookingStore(state => state.date);
  const setDate = useBookingStore(state => state.setDate);
  const setTime = useBookingStore(state => state.setTime);
  const numAdults = useBookingStore(state => state.numAdults);
  const numChild = useBookingStore(state => state.numChild);
  const dataBooking = useDataBookingStore(state => state.dataBooking);
  const setDataBooking = useDataBookingStore(state => state.setDataBooking);
  // state

  // const [listOption, setListOption] = useState<Array<TimeProp>>([]);
  const [timeSlotSelected, setTimeSlotSelected] = useState<string>("");
  const [showOtherTimeslotToday, setShowOtherTimeslotToday] =
    useState<boolean>(false);
  const [list5time, setList5time] = useState<{
    now: Array<TimeProp>;
    afterOneDay: Array<TimeProp>;
    afterTwoDay: Array<TimeProp>;
    afterThreeDay: Array<TimeProp>;
  }>({
    now: [],
    afterOneDay: [],
    afterTwoDay: [],
    afterThreeDay: [],
  });

  const [listOptionFuture, setListOptionFuture] = useState<{
    now: Array<TimeProp>;
    afterOneDay: Array<TimeProp>;
    afterTwoDay: Array<TimeProp>;
    afterThreeDay: Array<TimeProp>;
  }>({
    now: [],
    afterOneDay: [],
    afterTwoDay: [],
    afterThreeDay: [],
  });

  const [listAllServiceTimingToday, setListAllServiceTimingtoday] = useState<
    ListTimeProp[]
  >([]);
  const [isUsedParam, setIsUsedParam] = useState(false);

  // list root timeslot dropdown

  const listRootTimeSlotDropDown = generateListTime();
  const [listTimeSlotDropDown, setListTimeSlotDropDown] = useState<
    IListTimeSlot[]
  >(listRootTimeSlotDropDown);

  // func handle

  const fetchDataListTime = async () => {
    const [res, resAfterOneDay, resAfterTwoDay, resAfterThreeDays] =
      await Promise.all([
        bookingService.getListTime(outlet?.id, date, numAdults + numChild),
        bookingService.getListTime(
          outlet?.id,
          dateAfterNDays(1, date),
          numAdults + numChild
        ),
        bookingService.getListTime(
          outlet?.id,
          dateAfterNDays(2, date),
          numAdults + numChild
        ),
        bookingService.getListTime(
          outlet?.id,
          dateAfterNDays(3, date),
          numAdults + numChild
        ),
      ]);

    if (
      typeof res !== "string" &&
      typeof resAfterOneDay !== "string" &&
      typeof resAfterTwoDay !== "string" &&
      typeof resAfterThreeDays !== "string"
    ) {
      setListAllServiceTimingtoday(convertListTime(res));
      setListOptionFuture({
        now: renderListOption(res, date),
        afterOneDay: renderListOption(resAfterOneDay, date),
        afterTwoDay: renderListOption(resAfterTwoDay, date),
        afterThreeDay: renderListOption(resAfterThreeDays, date),
      });
    }
  };

  const handleSetTimeSlot = (timeslot: string) => {
    setTimeSlotSelected(timeslot);
  };

  const handleFind5NearlestTimeslot = () => {
    if (timeSlotSelected) {
      setList5time({
        now: generateListTimeAroundPreferredTime(
          timeSlotSelected,
          listOptionFuture?.now
        ).list5Time,
        afterOneDay: generateListTimeAroundPreferredTime(
          timeSlotSelected,
          listOptionFuture?.afterOneDay
        ).list5Time,
        afterTwoDay: generateListTimeAroundPreferredTime(
          timeSlotSelected,
          listOptionFuture?.afterTwoDay
        ).list5Time,
        afterThreeDay: generateListTimeAroundPreferredTime(
          timeSlotSelected,
          listOptionFuture?.afterThreeDay
        ).list5Time,
      });
    }
  };

  const generateNotify = (): string => {
    let rs = "";
    // todo
    const compare = find(
      listBlockedDate,
      e => e.date === moment(date, '"YYYY-MM-DD"').format("D")
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
    if (list5time?.now?.length < 5 && list5time?.now?.length > 0) {
      rs = `Only ${list5time?.now?.length} timeslots left between ${startTime} to ${endTime}`;
    }
    if (list5time?.now?.length === 0) {
      rs = `Sorry! There are currently no tables available between ${startTime} to ${endTime}.`;
    }
    return rs;
  };

  const handleParamTimeSlot = (timeSlot: string) => {
    const tempTime = moment(timeSlot, "hhmm").format("HH:mm:ss");
    const findTempTime = listTimeSlotDropDown.find(
      item => item.value === tempTime
    );
    if (findTempTime) {
      setTimeSlotSelected(tempTime);
      setIsUsedParam(true);
    } else {
      setTimeSlotSelected(listTimeSlotDropDown[0]?.value);
    }
  };

  useEffect(() => {
    if (outlet?.id) fetchDataListTime();
  }, [outlet?.id, date, numAdults + numChild]);

  useEffect(() => {
    if (timeSlotSelected) {
      const temp = generateListTimeAroundPreferredTime(
        timeSlotSelected,
        listOptionFuture?.now
      );

      handleFind5NearlestTimeslot();

      if (temp.list5Time.length > 0 && temp.timeSlotGenerated) {
        setTime(temp.timeSlotGenerated);
        setDataBooking({
          reservationDate: date,
          serviceTimingId: temp.timeSlotGenerated?.id as string,
          reservationTime: temp.timeSlotGenerated?.value as string,
          outletId: outlet?.id,
        });
        return;
      }
      setTime({ value: "", id: "", label: "" });
      setDataBooking({
        reservationTime: "",
        reservationDate: "",
        outletId: "",
        serviceTimingId: "",
      });
    }
  }, [timeSlotSelected, listOptionFuture]);

  useEffect(() => {
    setShowOtherTimeslotToday(
      listAllServiceTimingToday.length > 0 &&
        !find(
          listBlockedDate,
          e => e.date === moment(date, "YYYY-MM-DD").format("D")
        )
    );
  }, [listBlockedDate, date]);

  useEffect(() => {
    if (moment().format("YYYY-MM-DD") === date) {
      const temp = listTimeSlotDropDown?.filter(
        x => moment().diff(moment(x.value, "hh:mm:ss")) <= 0
      );

      if (temp.length > 0) {
        setListTimeSlotDropDown(temp);
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
        setTimeSlotSelected(temp[0]?.value);
        return;
      }
      setDate(moment().add("days", 1).format("YYYY-MM-DD"));
      setListTimeSlotDropDown(listRootTimeSlotDropDown);
      setTimeSlotSelected(listRootTimeSlotDropDown[0].value);
    } else {
      setListTimeSlotDropDown(listRootTimeSlotDropDown);
      if (!timeSlotSelected)
        setTimeSlotSelected(listRootTimeSlotDropDown[0].value);
    }
  }, [date]);

  useEffect(() => {
    if (!isUsedParam && defaultDate && listTimeSlotDropDown.length > 0) {
      setTimeSlotSelected(defaultTimeSlot as string);
      setIsUsedParam(true);
    }
  }, [date, defaultDate]);

  useEffect(() => {
    if (
      !isUsedParam &&
      router.query.timeslot &&
      listTimeSlotDropDown.length > 0
    ) {
      if (router.query.date) {
        const tempDate = moment(router.query.date, "DDMMYYYY").format(
          "YYYY-MM-DD"
        );
        if (moment(tempDate).diff(moment(), "hours") > 0) {
          setListTimeSlotDropDown(listRootTimeSlotDropDown);
        }
      }
      handleParamTimeSlot(router.query.timeslot as string);
    }
  }, [date, router.query.timeslot]);

  return (
    <>
      <div className="form-item">
        <CustomSelectNew
          value={timeSlotSelected}
          onChange={handleSetTimeSlot}
          label="Timeslot"
        >
          {listTimeSlotDropDown?.map(e => (
            <CustomMenuItem value={e.value} key={e.value}>
              {e.label}
            </CustomMenuItem>
          ))}
        </CustomSelectNew>
      </div>
      <div className="form-item">
        <div className="list-time-slot">
          <ContentAccordion
            dataBooking={dataBooking}
            setDataBooking={setDataBooking}
            listTime={list5time?.now}
            date={date}
            outletIdItem={outlet?.id}
          />
          {list5time?.now?.length < 5 && (
            <InlineNotification
              content={generateNotify()}
              isBg={!(list5time?.now?.length > 0)}
            />
          )}
        </div>
      </div>
      {timeSlotSelected && list5time?.now?.length === 0 && (
        <>
          <div className="divide" />
          {showOtherTimeslotToday ? (
            <>
              <OtherTimeSlotToday
                listTime={listAllServiceTimingToday}
                dataBooking={dataBooking}
                setDataBooking={setDataBooking}
                defaultExpanded
              />
              <FutureTimeslot
                list5time={list5time}
                timeSlotSelected={timeSlotSelected}
                dataBooking={dataBooking}
                setDataBooking={setDataBooking}
                date={date}
                outletIdItem={outlet?.id}
                listBlockedDate={listBlockedDate}
              />
            </>
          ) : (
            <FutureTimeslot
              list5time={list5time}
              timeSlotSelected={timeSlotSelected}
              dataBooking={dataBooking}
              setDataBooking={setDataBooking}
              date={date}
              outletIdItem={outlet?.id}
              defaultExpanded
              listBlockedDate={listBlockedDate}
            />
          )}
          <OtherOutletTimeSlot
            listOutlet={listOutlet}
            dataBooking={dataBooking}
            setDataBooking={setDataBooking}
            timeSlotSelected={timeSlotSelected}
          />
        </>
      )}
      <style jsx>
        {`
          .divide {
            height: 1px;
            width: 100%;
            background-color: #d6d6d6;
          }
        `}
      </style>
    </>
  );
}

export default SelectTimeSlot;
