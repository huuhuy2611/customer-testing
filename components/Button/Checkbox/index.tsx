import { Checkbox, CheckboxProps, withStyles } from "@material-ui/core";
import React from "react";

export const MyCheckbox = withStyles({
  root: {
    padding: "0",
    color: "#1C0056",
    width: "18px",
    height: "18px",
    "&$checked": {
      color: "#1C0056",
    },
    "& .MuiSvgIcon-root": {
      width: "18px",
      height: "18px",
    },
  },
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);
