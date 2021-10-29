import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { MyCheckbox } from "../Checkbox";

interface IProps {
  title?: string;
  onClick: () => void;
  width?: string;
}

function ButtonCheckbox(props: IProps): JSX.Element {
  const { title, onClick, width = "100%" } = props;
  const [checked, setChecked] = useState<boolean>(false);

  const handleClick = () => {
    onClick();
    setChecked(!checked);
  };
  return (
    <div className={`btn-checkbox ${checked ? "btn-checked" : ""}`}>
      <Button onClick={handleClick} fullWidth style={{ width }}>
        <MyCheckbox checked={checked} />
        <span className='ml-8'>{title}</span>
      </Button>
      <style jsx>
        {`
          .btn-checkbox {
            :global(.MuiButton-root) {
              border: 1px solid #d6d6d6;
              box-sizing: border-box;
              border-radius: 6px;
              background: #ffffff;
              padding-left: 12.5px;
              height: 46px;
              text-transform: none;
              :global(.MuiButton-label) {
                font-weight: 500;
                font-size: 16px;
                line-height: 20px;
                justify-content: initial;
              }
            }
            &.btn-checked {
              :global(.MuiButton-root) {
                border: 1px solid #1c0056;
                background: rgba(28, 0, 86, 0.1);
              }
            }
          }
        `}
      </style>
    </div>
  );
}

export default ButtonCheckbox;
