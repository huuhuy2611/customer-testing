import MyOutlinedInput from "@/components/Input/MyOutlinedInput";
import React, { useState } from "react";

interface IProps {
  type?: "note" | "occasion";
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

function TextArea({ type = "note", setValue }: IProps): JSX.Element {
  const [countText, setCountText] = useState<number>(0);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCountText(e.target.value.length);
    setValue(e.target.value);
  };
  return (
    <div>
      <MyOutlinedInput
        fullWidth
        multiline
        label={`${type === "note" ? "Special Requests" : "Other Occasions"}`}
        onChange={handleChange}
        rows={4}
        inputProps={{
          maxLength: 120,
        }}
      />
      <div className='d-flex justify-content-between'>
        <p>{`${
          type === "note" ? "Requests are subjected to availability" : ""
        }`}</p>
        <p>{countText}/120</p>
        <style jsx>
          {`
            div {
              margin-top: 3px;
            }
            p {
              font-size: 12px;
              line-height: 14px;
              color: #515151;
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default TextArea;
