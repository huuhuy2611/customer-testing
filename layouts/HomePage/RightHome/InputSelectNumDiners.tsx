import React, { useState, useEffect } from "react";
import {
  withStyles,
  TextField,
  InputAdornment,
  Popover,
  Divider,
} from "@material-ui/core";
import { useRouter } from "next/router";
import { IconDecrement, IconIncrement } from "@/assets/img";
import { BookingStoreProp, useBookingStore } from "@/store/store";

const MyOutlinedInput = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "3px",
      "& fieldset": {
        border: "1px solid #D6D6D6",
      },
      "&:hover fieldset": {
        border: "1px solid #1C0056",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid #1C0056",
      },
    },
    "& .MuiOutlinedInput-input": {
      fontSize: "16px",
      lineHeight: "20px",
      height: "20px",
      padding: "16px 20px",
      color: "#000000",
      cursor: "pointer",
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
    "& .Mui-disabled": {
      background: "#FFFFFF",
    },
  },
})(TextField);

const MyPopover = withStyles({
  paper: {
    width: "375px",
    height: "154px",
    padding: "0 20px",
    boxSizing: "border-box",
  },
  root: {
    fontFamily: "Jost",
    padding: "10px 20px",
    minHeight: "40px",
    lineHeight: "20px",
    background: "none !important",
    "&.MuiListItem-root.Mui-focusVisible": {
      backgroundColor: "#F6F6F6 !important",
    },
    "& .btn": {
      border: "none",
      background: "none",
      height: "36px",
      width: "37px",
      padding: "0",
      margin: "0",
      cursor: "pointer",
      transition: "0.2s",
    },
    "& .btn-disable": {
      opacity: 0.3,
      cursor: "default",
    },
    "& .select-type": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      height: "76px",
      "& .label": {
        color: "#000000",
        fontWeight: "600",
      },
    },
    "& .control": {
      minWidth: "122px",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
    },
    "& .MuiTouchRipple-root": {
      display: "none",
    },
  },
})(Popover);

interface IProps {
  maxPax: number;
  width?: string;
  defaultAdult?: number;
  defaultChild?: number;
}

function InputSelectNumDiners(props: IProps): JSX.Element {
  const router = useRouter();
  const { maxPax, width, defaultAdult, defaultChild } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [adults, setAdults] = useState<number>(2);
  const [child, setChild] = useState<number>(0);
  const [value, setValue] = useState({
    label: "2 Adults",
    value: 2,
  });
  const [refQuery, setRefQuery] = useState(false);

  // store zustand

  const setNumChild = useBookingStore(
    (state: BookingStoreProp) => state.setNumChild
  );
  const setNumAdults = useBookingStore(
    (state: BookingStoreProp) => state.setNumAdults
  );

  const handleClick: React.MouseEventHandler<HTMLDivElement> | undefined =
    event => {
      setAnchorEl(event.currentTarget);
    };

  const handleClose = () => {
    setAnchorEl(null);
    setNumChild(child);
    setNumAdults(adults);
    setValue({
      label: `${
        adults > 0 ? `${adults} ${adults > 1 ? "Adults" : "Adult"}` : ""
      }${child > 0 ? `, ${child} ${child > 1 ? "Children" : "Child"}` : ""}`,
      value: adults + child,
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleSetNum = (type: "child" | "adult", action: "incre" | "decre") => {
    switch (type) {
      case "adult":
        if (action === "incre" && adults < maxPax - child)
          setAdults(adults + 1);
        if (action === "decre" && adults > 1) setAdults(adults - 1);
        break;
      case "child":
        if (action === "incre" && child < maxPax - adults) setChild(child + 1);
        if (action === "decre" && child > 0) setChild(child - 1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (
      defaultAdult &&
      defaultChild &&
      (defaultAdult !== adults || defaultChild !== child)
    ) {
      setChild(defaultChild);
      setAdults(defaultAdult);
      setValue({
        label: `${
          defaultAdult > 0
            ? `${defaultAdult} ${defaultAdult > 1 ? "Adults" : "Adult"}`
            : ""
        }${
          defaultChild > 0
            ? `, ${defaultChild} ${defaultChild > 1 ? "Children" : "Child"}`
            : ""
        }`,
        value: defaultAdult + defaultChild,
      });
    }
  }, [defaultAdult, defaultChild]);

  useEffect(() => {
    // if (router.query.adult) {
    //   setNumAdults(Number(router.query.adult));
    //   setAdults(Number(router.query.adult));
    //   setValue({
    //     label: `${
    //       Number(router.query.adult) > 0
    //         ? `${Number(router.query.adult)} ${
    //             Number(router.query.adult) > 1 ? "Adults" : "Adult"
    //           }`
    //         : ""
    //     }${child > 0 ? `, ${child} ${child > 1 ? "Children" : "Child"}` : ""}`,
    //     value: Number(router.query.adult) + child,
    //   });
    // }
    // if (router.query.child) {
    //   setNumChild(Number(router.query.child));
    //   setChild(Number(router.query.child));
    //   setValue({
    //     label: `${
    //       adults > 0 ? `${adults} ${adults > 1 ? "Adults" : "Adult"}` : ""
    //     }${
    //       Number(router.query.child) > 0
    //         ? `, ${Number(router.query.child)} ${
    //             Number(router.query.child) > 1 ? "Children" : "Child"
    //           }`
    //         : ""
    //     }`,
    //     value: adults + Number(router.query.child),
    //   });
    // }

    if (router.query.child) {
      setChild(Number(router.query.child));
    }
    if (router.query.adult) {
      setAdults(Number(router.query.adult));
    }
    setRefQuery(true);
  }, [router.query]);

  useEffect(() => {
    if (refQuery) handleClose();
    setRefQuery(false);
  }, [refQuery]);

  return (
    <div className="select-number">
      <MyOutlinedInput
        aria-describedby={id}
        label="Number of Diners"
        value={value?.label}
        variant="outlined"
        disabled
        onClick={handleClick}
        style={{ width: width || "100%" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <svg
                className="MuiSvgIcon-root MuiSelect-icon MuiSelect-iconOutlined"
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </InputAdornment>
          ),
        }}
      />
      <MyPopover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className="select-type">
          <div className="label">Adults</div>
          <div className="control">
            <button
              className={`btn ${adults === 1 ? "btn-disable" : ""}`}
              type="button"
              onClick={() => handleSetNum("adult", "decre")}
            >
              <IconIncrement />
            </button>
            <span>{adults}</span>
            <button
              className="btn"
              type="button"
              onClick={() => handleSetNum("adult", "incre")}
            >
              <IconDecrement />
            </button>
          </div>
        </div>
        <Divider />
        <div className="select-type">
          <div className="label">Children</div>
          <div className="control">
            <button
              className={`btn ${child === 0 ? "btn-disable" : ""}`}
              type="button"
              onClick={() => handleSetNum("child", "decre")}
            >
              <IconIncrement />
            </button>
            <span>{child}</span>
            <button
              className="btn"
              type="button"
              onClick={() => handleSetNum("child", "incre")}
            >
              <IconDecrement />
            </button>
          </div>
        </div>
      </MyPopover>
      <style jsx>
        {`
          .select-number {
            :global(.MuiOutlinedInput-root.Mui-disabled
                .MuiOutlinedInput-notchedOutline) {
              ${open ? "border: 1px solid #1c0056" : ""}
            }
          }
        `}
      </style>
    </div>
  );
}

export default InputSelectNumDiners;
