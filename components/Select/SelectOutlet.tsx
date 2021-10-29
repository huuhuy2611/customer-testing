import React, {useEffect} from "react";
import {withStyles} from "@material-ui/core/styles";
import {FormControl} from "@material-ui/core";
import {useRouter} from "next/router";
import {BookingStoreProp, OutletProp, useBookingStore} from "@/store/store";
import {MenuItemSelectOutlet, MyInputLabel, MySelect} from ".";

interface ICustomSelect {
  width?: string;
  listOption: Array<OutletProp>;
  label?: string;
  defaultValue?: number | string;
  onChange: (value: string) => void;
}

function SelectOutlet(props: ICustomSelect): JSX.Element {
  const {
    width = "100%",
    listOption,
    label,
    defaultValue = "",
    onChange,
  } = props;
  
  const router = useRouter();

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

  const outlet = useBookingStore((state: BookingStoreProp) => state.outlet);

  useEffect(() => {
    if (router.query.outletId) {
      onChange(router.query.outletId as string);
    }
  }, []);

  return (
    <MyFormControl variant="outlined">
      <MyInputLabel id="input-select">{label}</MyInputLabel>
      <MySelect
        value={outlet?.id || defaultValue}
        onChange={e => onChange(e.target.value as string)}
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
        labelId="input-select"
        id="unique"
      >
        {listOption.map(e => (
          <MenuItemSelectOutlet value={e.id} key={e.id}>
            <p className="outlet">{e.outlet}</p>
            <p className="address">{e.address}</p>
          </MenuItemSelectOutlet>
        ))}
      </MySelect>
    </MyFormControl>
  );
}

export default SelectOutlet;
