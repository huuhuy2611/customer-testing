import { Button } from "@material-ui/core";
import React from "react";
import { convertTime } from "@/common/ultil/convertTime";

interface IProps {
  time: string;
  value: string;
  status?: "active" | "default" | "inactive" | "blocked" | string;
  onClick: (value: string) => void;
  width?: string;
}

function ButtonTime(props: IProps): JSX.Element {
  const { time, value, status = "default", onClick, width = "100%" } = props;

  return (
    <Button
      onClick={() => onClick(value)}
      className={`btn-time btn-time-${status}`}
      style={{ width }}
    >
      {convertTime(time)}
    </Button>
  );
}

export default ButtonTime;
