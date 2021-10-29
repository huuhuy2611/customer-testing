import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  createTheme,
  Dialog,
  Slide,
  ThemeProvider,
  withStyles,
} from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { ReactElement, useEffect, useState, ComponentType } from "react";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import lightBlue from "@material-ui/core/colors/lightBlue";
import dynamic from "next/dynamic";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { TransitionProps } from "@material-ui/core/transitions";
import { Close } from "@material-ui/icons";
import { useBookingStore } from "@/store/store";
import { dayOfWeek } from "@/layouts/HomePage/RightHome/tool";

const MyAccordion = withStyles({
  root: {
    border: "1px solid #D6D6D6",
    borderRadius: "3px",
    boxShadow: "none",
    "&.Mui-expanded": {
      border: "1px solid #515151",
    },
    "&:hover": {
      border: "1px solid #515151",
    },
  },
})(Accordion);

const MyAccordionSummary = withStyles({
  root: {
    height: "52px",
    minHeight: "unset",
    "&.Mui-expanded": {
      minHeight: "unset",
      padding: "0 20px",
    },
  },
})(AccordionSummary);

const MyAccordionDetails = withStyles({
  root: {
    padding: "0 20px",
    justifyContent: "center",
  },
})(AccordionDetails);

const Transition = React.forwardRef(
  (props: React.ReactElement<any, any>, ref) => (
    <Slide direction="down" ref={ref} {...props} />
  )
);

const materialTheme = createTheme({
  overrides: {
    MuiPickersStaticWrapper: {
      staticWrapperRoot: {
        width: "100%",
        alignItems: "center",
      },
    },
    MuiPickersBasePicker: {
      container: {
        width: "100%",
        alignItems: "center",
      },
      pickerView: {
        maxWidth: "unset",
        minWidth: "unset",
        minHeight: "unset",
        width: "100%",
        padding: "0 20px 30px",
      },
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        color: "#000000",
        borderBottom: "1px solid #D6D6D6",
        paddingBottom: "10px",
        marginBottom: "10px",
      },
      iconButton: {
        padding: "0",
      },
      transitionContainer: {
        "& p": {
          fontFamily: "Jost",
          fontSize: "18px",
          fontWeight: "bold",
        },
      },
      daysHeader: {
        // borderBottom: "1px solid #D6D6D6",
        // height: "15px",
      },
      dayLabel: {
        margin: "0",
        width: "40px",
        fontSize: "14px",
        fontFamily: "Jost",
      },
    },
    MuiPickersDay: {
      day: {
        width: "40px",
        height: "40px",
        margin: "0",
        "& p": {
          color: "#212121",
          fontSize: "16px",
          fontFamily: "Jost",
        },
      },
      daySelected: {
        backgroundColor: "#1C0056",
        "& p": {
          color: "#FFFFFF !important",
        },
      },
      dayDisabled: {
        "& p": {
          color: "#BBBBBB",
        },
      },
      current: {
        color: lightBlue["900"],
      },
    },
    MuiPickersModal: {
      dialogAction: {
        color: lightBlue["400"],
      },
    },
  },
});

interface IProps {
  defaultDate?: string;
  listDateBlur?: string[];
  setMonthDatePicker?: React.Dispatch<React.SetStateAction<string>>;
}

function DatePickerWidget(props: IProps): JSX.Element {
  const {
    defaultDate,
    listDateBlur = ["15", "16"],
    setMonthDatePicker,
  } = props;
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const setDate = useBookingStore(state => state.setDate);
  const date = useBookingStore(state => state.date);

  const [labelDate, setLabelDate] = useState(dayOfWeek(date));

  const [selectedDate, setSelectedDate] = useState<
    Date | undefined | null | string
  >(date);

  const handleDateChange = (dateSelected: Date | null) => {
    setLabelDate(dayOfWeek(moment(dateSelected).format("YYYY-MM-DD")));
    setSelectedDate(dateSelected);
    setDate(moment(dateSelected).format("YYYY-MM-DD"));
    setIsShowDatePicker(false);
  };

  const renderDayInPicker = (
    _date: MaterialUiPickersDate,
    _selectedDate: MaterialUiPickersDate,
    _dayInCurrentMonth: boolean,
    dayComponent: JSX.Element
  ) => (
    <div
      className={`${
        listDateBlur?.includes((_date?.getDate() as number).toString())
          ? "blur"
          : ""
      }`}
    >
      {dayComponent}
    </div>
  );

  useEffect(() => {
    if (defaultDate) {
      if (moment(defaultDate, "YYYY-MM-DD").diff(moment(), "days") >= 0)
        handleDateChange(moment(defaultDate, "YYYY-MM-DD").toDate());
    }
  }, [defaultDate]);

  const onMonthChange = (_date: MaterialUiPickersDate) => {
    if (_date && setMonthDatePicker)
      setMonthDatePicker(`${_date.getFullYear()}-${_date.getMonth() + 1}`);
  };

  return (
    <div className="datepicker">
      <MyAccordion>
        <MyAccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
          onClick={() => setIsShowDatePicker(!isShowDatePicker)}
        >
          <span className="label-date">{labelDate}</span>
        </MyAccordionSummary>
      </MyAccordion>
      <Dialog
        onClose={() => setIsShowDatePicker(false)}
        open={isShowDatePicker}
        TransitionComponent={
          Transition as unknown as ComponentType<
            TransitionProps & { children?: ReactElement<any, any> | undefined }
          >
        }
      >
        <div className="close-div">
          <Close
            style={{ cursor: "pointer" }}
            onClick={() => setIsShowDatePicker(false)}
          />
        </div>
        <MyAccordionDetails>
          <>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <ThemeProvider theme={materialTheme}>
                <DatePicker
                  renderDay={renderDayInPicker}
                  value={selectedDate}
                  format="yyyy-MM-dd"
                  id="date-picker-dialog"
                  onChange={handleDateChange}
                  disableToolbar
                  autoOk
                  okLabel=""
                  cancelLabel=""
                  inputVariant="standard"
                  variant="static"
                  label="Select Date"
                  fullWidth
                  disablePast
                  onMonthChange={onMonthChange}
                />
              </ThemeProvider>
            </MuiPickersUtilsProvider>
          </>
        </MyAccordionDetails>
      </Dialog>

      <div className="label">Select Date</div>
      <style jsx>
        {`
          .close-div {
            display: flex;
            justify-content: flex-end;
            padding: 10px 10px 0 0;
          }
          :global(.MuiDialog-paperScrollPaper) {
            max-height: calc(100% - 30px);
          }
          :global(.MuiDialog-paper) {
            @media (max-width: 375px) {
              margin: 16px;
            }
          }
          .datepicker {
            position: relative;
            .label {
              color: #515151;
              font-size: 12px;
              line-height: 14px;
              padding: 0 5px;
              background: white;
              position: absolute;
              top: -7px;
              left: 10px;
            }
            .label-date {
              font-size: 16px;
              line-height: 20px;
              color: #000000;
            }
            :global(.blur p) {
              color: #bbbbbb !important;
            }
          }
        `}
      </style>
    </div>
  );
}

// export default DatePickerWidget;
export default dynamic(() => Promise.resolve(DatePickerWidget), {
  ssr: false,
});
