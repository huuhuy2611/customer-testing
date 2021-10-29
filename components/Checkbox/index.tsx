import {Checkbox, FormControlLabel} from "@material-ui/core";
import React from "react";

interface IProps {
  content?: string;
  checked: boolean;
  setChecked?: (arg0: boolean) => void;
}

function CustomCheckbox(props: IProps): JSX.Element {
  const {content, checked, setChecked} = props;
  return (
    <div className="custom-checkbox">
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={() => setChecked && setChecked(!checked)}
            name="checkedA"
          />
        }
        label={content}
      />
      <style jsx>{`
      .custom-checkbox {
          text-align: center;
        :global(.MuiCheckbox-colorSecondary.Mui-checked) {
            color: #1C0056;
        }
        :global(.MuiTypography-body1) {
            color: black;
            font-size: 14px;
        }
      }
        
      `}</style>
    </div>
  );
}

export default CustomCheckbox;
