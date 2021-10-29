import React, { useState } from "react";
import MyOutlinedInput from "@/components/Input/MyOutlinedInput";
import CustomButtonNew from "@/components/Button/CustomButton";
import { REGEXS } from "@/common/constant/Regex";

interface IProps {
  handleContinue: () => void;
  email: string;
  setEmail: (arg0: string) => void;
}

function CheckEmail(props: IProps): JSX.Element {
  const [showNext, setShowNext] = useState<boolean>(false);
  const [errorEmail, setErrorEmail] = useState<boolean>(false);
  const [helperText, setHelperText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { handleContinue, email, setEmail } = props;

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorEmail(false);
    setHelperText("");
    if (REGEXS.EMAIL.test(e.target.value) || REGEXS.EMAIL.test(email)) {
      setShowNext(true);
    } else {
      setShowNext(false);
    }
  };

  const validateEmail = (e: React.FocusEvent<HTMLInputElement>) => {
    if (REGEXS.EMAIL.test(e.target.value)) {
      setShowNext(true);
      setErrorEmail(false);
      setHelperText("");
    } else {
      setShowNext(false);
      setErrorEmail(true);
      setHelperText("Please enter a valid email address e.g john@oddle.me");
    }
  };

  return (
    <div>
      <div className="input mb-20">
        <MyOutlinedInput
          // disabled
          autoFocus
          fullWidth
          label="Email Address"
          variant="outlined"
          value={email}
          onChange={handleChangeInput}
          onBlur={validateEmail}
          error={errorEmail}
          helperText={helperText}
          onKeyUp={(ev) => {
            if (ev.key === "Enter") {
              if (!REGEXS.EMAIL.test(email)) return;
              handleContinue();
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
              }, 1000);
            }
          }}
        />
      </div>
      <CustomButtonNew
        text="Continue"
        type="primary"
        onClick={handleContinue}
        disabled={!showNext}
        loading={loading}
      />
    </div>
  );
}

export default CheckEmail;
