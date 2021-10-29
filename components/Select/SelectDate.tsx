import React, { useState, useEffect } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import { InputAdornment } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import "date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import { DropdownIcon } from "@/assets/img";

interface ICalendar {
  setDate: (date: string) => void;
  defaultValueProps?: number | string;
}

function SelectDate(props: ICalendar): JSX.Element {
  const { setDate, defaultValueProps } = props;
  const today = moment().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState<Date | null | string>(null);
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setDate(moment(date).format("YYYY-MM-DD"));
  };

  useEffect(() => {
    if (moment().diff(moment(defaultValueProps)) > 0) {
      setDate(moment().format("YYYY-MM-DD"));
      setSelectedDate(moment().format("YYYY-MM-DD"));
    } else setSelectedDate(defaultValueProps as string);
  }, [defaultValueProps, setDate]);

  const MyInputLabel = withStyles({
    root: {
      fontFamily: "Jost",
      padding: "0 12px",
      fontSize: "16px",
      letterSpacing: "0.005em",
      color: "#121212",
      display: selectedDate !== today ? "none" : "block",
      top: "20px",
      position: "absolute",
    },
  })(InputLabel);

  const useStyles = makeStyles(() => ({
    root: {
      position: "relative",
      "& .MuiInputBase-input": {
        visibility: selectedDate === today ? "hidden" : "inherit",
      },
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border: "1px solid #1C0056",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: "1px solid #D6D6D6",
      },
      "& .MuiFormLabel-root": {
        fontFamily: "Jost",
        color: "#515151",
      },
      "& .MuiOutlinedInput-input": {
        fontSize: "16px",
        lineHeight: "20px",
        height: "20px",
        padding: "16px 20px",
        color: "#000000",
      },
    },
  }));

  const classes = useStyles();

  useEffect(() => {
    setSelectedDate(defaultValueProps as string);
  }, [defaultValueProps]);

  return (
    <div className={classes.root}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          inputVariant="outlined"
          label="Select Date"
          value={selectedDate}
          format="yyyy-MM-dd"
          id="date-picker-dialog"
          onChange={handleDateChange}
          style={{ width: "100%" }}
          disablePast
          disableToolbar
          autoOk
          okLabel=""
          cancelLabel=""
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <img {...DropdownIcon} alt="" />
              </InputAdornment>
            ),
          }}
        />
        <MyInputLabel>Today</MyInputLabel>
      </MuiPickersUtilsProvider>
    </div>
  );
}

export default SelectDate;
