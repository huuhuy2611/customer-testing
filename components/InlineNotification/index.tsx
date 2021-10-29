import React, { ReactElement, useEffect, useState, ReactNode } from "react";
import { Chip } from "@material-ui/core";
import { ReportProblemOutlined, InfoOutlined } from "@material-ui/icons";

interface IProps {
  type?: "general" | "warning" | "error";
  isBg?: boolean;
  content?: string | ReactNode;
}

function InlineNotification(props: IProps): JSX.Element {
  const { type, isBg, content } = props;
  const [icon, setIcon] = useState<ReactElement>();
  const [color, setColor] = useState<"default" | "primary" | "secondary">(
    "primary"
  );
  
  const [isShowBg, setIsShowBg] = useState<boolean>(true);

  useEffect(() => {
    switch (type) {
      case "general":
        setIcon(
          <span style={{ fontSize: "18px" }}>
            <InfoOutlined fontSize="inherit" />
          </span>
        );
        setColor("primary");
        break;
      case "warning":
        setIcon(<ReportProblemOutlined style={{ color: "#F2A440" }} />);
        setColor("default");
        break;
      case "error":
        setIcon(<InfoOutlined style={{ color: "#D62105" }} />);
        setColor("secondary");
        break;
      default:
        setIcon(<InfoOutlined />);
        setColor("primary");
        break;
    }
    if (isBg !== undefined) {
      setIsShowBg(isBg);
    }
  }, [props]);

  return (
    <div className="custom-chip">
      <Chip
        className={isShowBg ? "" : "hide-bg"}
        icon={icon}
        label={
          content ||
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
        }
        color={color}
      />
      <style jsx>
        {`
          .custom-chip {
            :global(.MuiChip-root) {
              display: flex;
              align-items: flex-start;
            }
            :global(.MuiChip-label) {
              font-size: 14px;
              line-height: 20px;
              font-weight: 500;
              text-align: left;
            }
            :global(.MuiChip-root) {
              width: 100%;
              justify-content: flex-start;
            }
          }
        `}
      </style>
    </div>
  );
}

export default InlineNotification;
