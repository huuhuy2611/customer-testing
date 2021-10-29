import { InputLabel, MenuItem, Select, withStyles } from "@material-ui/core";

export const MySelect = withStyles({
  root: {
    "& .address": {
      display: "none",
    },
  },
})(Select);

export const MyInputLabel = withStyles({
  root: {
    fontFamily: "Jost",
    color: "#515151",
  },
})(InputLabel);

export const CustomMenuItem = withStyles({
  root: {
    fontFamily: "Jost",
    padding: "10px 20px",
    minHeight: "40px",
    lineHeight: "20px",
    // background: "none !important",
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
    },
    "& .select-type": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
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
})(MenuItem);

export const MenuItemSelectOutlet = withStyles({
  root: {
    fontFamily: "Jost",
    padding: "10px 20px",
    minHeight: "40px",
    lineHeight: "20px",
    display: "block",
    "& .address": {
      fontSize: "14px",
    },
    "&.MuiListItem-root.Mui-focusVisible": {
      backgroundColor: "#F6F6F6 !important",
    },
  },
})(MenuItem);
