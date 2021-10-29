import { Button, CircularProgress, makeStyles } from "@material-ui/core";
import React from "react";

interface IProps {
  type?: "primary" | "success" | "secondary" | "alert";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  size?: "sm" | "md";
  onClick?: () => void;
  style?: React.CSSProperties;
  width?: string;
  text?: string;
  loading?: boolean;
  disabled?: boolean;
}

const BACKGROUND_COLOR = {
  primary: {
    bg: "#1C0056",
    color: "#FFFFFF",
  },
  success: {
    bg: "#27CA27",
    color: "#FFFFFF",
  },
  secondary: {
    bg: "#FFFFFF",
    color: "#1C0056",
  },
  alert: {
    bg: "#D62105",
    color: "#FFFF",
  },
};

function CustomButtonNew(props: IProps): JSX.Element {
  const {
    type = "secondary",
    size = "md",
    onClick,
    style,
    width = "100%",
    text,
    startIcon,
    endIcon,
    loading = false,
    disabled = false,
  } = props;

  const useStyles = makeStyles({
    root: {
      backgroundColor: BACKGROUND_COLOR[type].bg,
      padding: size === "md" ? "0 20px" : "0 10px",

      color: BACKGROUND_COLOR[type].color,
      fontWeight: 600,
      fontSize: size === "md" ? "16px" : "14px",
      fontFamily:
        "Jost, -apple-system, Roboto, Segoe UI,Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif",
      textTransform: "none",

      borderRadius: type === "secondary" ? "4px" : "6px",
      border: type === "secondary" ? "1px solid #D6D6D6" : "",
      ...style,
      width,
      height: size === "md" ? "46px" : "32px",
      "& .MuiButton-endIcon": {
        width: "20px",
      },
      "& .MuiButton-startIcon": {
        position: "absolute",
        width: "20px",
      },
      "& .content": {
        width: "95%",
      },
      "&.MuiButton-root.Mui-disabled": {
        background: "rgba(0, 0, 0, 0.12)",
        color: "rgba(0, 0, 0, 0.6)",
      },
      "&:hover": {
        backgroundColor: BACKGROUND_COLOR[type].bg,
        opacity: "0.8",
      },
    },
  });

  const classes = useStyles();

  return (
    <>
      <Button
        disabled={disabled}
        className={classes.root}
        onClick={onClick}
        startIcon={startIcon}
        endIcon={endIcon}
        style={{
          height: `${type === "secondary" && size === "md" ? "39px" : ""}`,
        }}
      >
        <span className='content'>{text}</span>
        {loading && (
          <CircularProgress size={18} color={"white" as unknown as undefined} />
        )}
      </Button>
    </>
  );
}

export default CustomButtonNew;
