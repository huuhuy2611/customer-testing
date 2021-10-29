import React, { ReactNode } from "react";
import { withStyles } from "@material-ui/core/styles";
import { FormControl } from "@material-ui/core";
import { MyInputLabel, MySelect } from "./index";

interface ICustomSelectNew {
  width?: string;
  label?: string;
  onChange: (value: string) => void;
  value?: string;
  children?: ReactNode;
}

function CustomSelectNew(props: ICustomSelectNew): JSX.Element {
  const { width = "100%", label, onChange, value, children } = props;

  const MyFormControl = withStyles({
    root: {
      width,
      "& .MuiFormLabel-root.Mui-focused": {
        color: "#1C0056",
      },
      "& .MuiOutlinedInput-root": {
        borderRadius: "3px",
      },
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border: "1px solid #1C0056",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: "1px solid #D6D6D6",
      },
      "& .MuiOutlinedInput-input": {
        fontSize: "16px",
        lineHeight: "20px",
        height: "20px",
        padding: "16px 20px",
        color: "#000000",
      },
    },
  })(FormControl);

  return (
    <MyFormControl variant='outlined'>
      <MyInputLabel id='input-select'>{label}</MyInputLabel>
      <MySelect
        value={value || ""}
        onChange={(e) => onChange(e.target.value as string)}
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          getContentAnchorEl: null,
        }}
        label={label}
        labelId='input-select'
        id='unique'
      >
        {children}
      </MySelect>
    </MyFormControl>
  );
}

export default CustomSelectNew;
