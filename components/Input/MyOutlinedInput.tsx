import { withStyles, TextField, TextFieldProps } from "@material-ui/core";
import React from "react";

const MyOutlinedInput = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "3px",
    },
    "& .MuiOutlinedInput-input": {
      fontSize: "16px",
      lineHeight: "20px",
      height: "20px",
      padding: "16px 20px",
      color: "#000000",
    },
    "& .MuiOutlinedInput-multiline": {
      padding: 0,
      "& .MuiOutlinedInput-inputMultiline": {
        height: "75px",
      },
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
    "& .MuiFormLabel-root.Mui-error": {
      color: "#D62105",
      opacity: "1",
    },
    "& .MuiFormLabel-root.Mui-disabled": {
      background: "transparent",
    },
    "& .Mui-disabled": {
      background: "#F1F1F1",
      "& .MuiOutlinedInput-notchedOutline": {
        border: "1px solid #D6D6D6;",
      },
    },
    "& .MuiFormHelperText-root.Mui-error": {
      color: "#D62105",
      fontFamily: "Jost",
    },
    "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: "#D62105",
    },
  },
})((props: TextFieldProps) => (
  <TextField fullWidth variant='outlined' {...props} />
));

export default MyOutlinedInput;
