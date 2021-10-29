import React, {useState} from "react";
import {IconButton, InputAdornment} from "@material-ui/core";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import MyOutlinedInput from "@/components/Input/MyOutlinedInput";
import {REGEXS} from "@/common/constant/Regex";
import {
  IconStarYellow,
  OddlePassLogo,
  OddlePassLogoCustomerLogin,
  OddlePassLogoVertical,
} from "@/assets/img";
import CustomButtonNew from "@/components/Button/CustomButton";
import CustomCheckbox from "@/components/Checkbox";
import {useAuthGuestStore ,useDataBookingStore} from "@/store/store";
import authService from "@/services/auth.service";
import {RESERVE_APP_ID, RESERVE_APP_NAME} from "@/common/config";

function CreateAsGuest(): JSX.Element {
  const dataGuest = useAuthGuestStore(state => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
  });
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const [checkedReceive, setCheckedReceive] = useState(true);

  const dataBooking = useDataBookingStore(state => state.dataBooking);

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setErrors(prev => ({...prev, password: ""}));
    setPassword(value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (REGEXS.PASSWORD.test(password)) {
      setIsLoading(true);
      const { email, firstname, lastname, phone, countryCode } = dataGuest;
      const outletId = dataBooking?.outletId;
      const register = await authService.register(
        email,
        lastname,
        firstname,
        phone,
        password,
        checkedReceive,
        countryCode as string,
        outletId 
      );

      if (register && typeof register !== "string") {
        setIsRegisterSuccess(true);
        window.analytics.identify(register?.oddlePassId, {
          firstName: register?.firstName,
          lastName: register?.lastName,
          email: register?.email,
          phone: register?.phone,
        });
        window.analytics.track("Signed In", {
          app: {
            id: RESERVE_APP_ID,
            name: RESERVE_APP_NAME,
          },
        });
      } else {
        setErrors(prev => ({...prev, password: "Password is invalid"}));
      }

      setIsLoading(false);
      return;
    }
    setErrors(prev => ({...prev, password: "Password is invalid"}));
  };

  return (
    <div className="login-oddle div-center">
      {isRegisterSuccess ? (
        <div>
          <div className="header-login mb-20">
            <h6 className="fw-700 fs-18">Welcome to your Oddle Pass</h6>
            <p>Access all Oddle services with one login.</p>
          </div>
          <div className=" div-center mb-20">
            <OddlePassLogoCustomerLogin className="mr-16" />
            <div className="fs-16 info-guest">
              <p className="fw-500">
                {dataGuest?.firstname} {dataGuest?.lastname}
              </p>
              <p className="color-393939">{dataGuest?.email}</p>
              <p className="color-393939">{dataGuest?.phone}</p>
            </div>
          </div>
          <div className="div-center oddle-privacy mb-20">
            <div className="oddle-logo">
              <OddlePassLogo className="mr-0" />
            </div>
            <span>
              You may edit your Oddle Pass account details <a>here</a>
            </span>
          </div>
        </div>
      ) : (
        <div className="w-90">
          <div className="header-login mb-20">
            <OddlePassLogoVertical className="mb-16" />
            <h6 className="fw-700 fs-18">Create an Account</h6>
          </div>
          <div className="content-intro mb-20">
            <div className="mb-8 div-center fs-14">
              <IconStarYellow />
              <span>Faster reservations and check outs</span>
            </div>
            <div className="mb-8 div-center fs-14">
              <IconStarYellow />
              <span>Quick view of all reservations in one place</span>
            </div>
            <div className="mb-8 div-center fs-14">
              <IconStarYellow />
              <span>Access to great deals and Oddle Eats vouchers</span>
            </div>
          </div>
          <div className="mb-20">
            <div className="custom-input-password">
              <MyOutlinedInput
                type={showPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                label="Password"
                placeholder="Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        // onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={handleChangePassword}
                error={!!errors.password}
                  helperText={errors?.password}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleLogin()        
                  }}
              />
            </div>

            <div className="mb-8 mt-8">
              <CustomCheckbox
                content="Receive promotions and updates from Oddle"
                checked={checkedReceive}
                setChecked={setCheckedReceive}
              />
            </div>
            <div className="mb-20">
              <CustomButtonNew
                loading={isLoading}
                type={isRegisterSuccess ? "success" : "primary"}
                text={
                  isRegisterSuccess ? "Sign up successful" : "Create Oddle Pass"
                }
                onClick={handleLogin}
              />
            </div>
          </div>

          <div className="div-center oddle-privacy mb-20">
            <div className="oddle-logo">
              <OddlePassLogo className="mr-0" />
            </div>
            <span>
              By continuing, you agree to Oddle&apos;s{" "}
              <a
                target="_blank"
                href="https://oddle.me/oddle-pass-terms-of-use/"
                rel="noreferrer"
              >
                T&Cs
              </a>{" "}
              &{" "}
              <a
                target="_blank"
                href="https://oddle.me/privacy-policy"
                rel="noreferrer"
              >
                Privacy Policy
              </a>
            </span>
          </div>
        </div>
      )}

      <style jsx>{`
        .login-oddle {
          background-color: #f6f6f6;
          color: black;
          border-radius: 6px;
          padding: 0 16px;

          .info-guest {
            text-align: left;
          }

          .header-login {
            padding: 20px 0;
            border-bottom: 1px solid #d6d6d6;
            text-align: center;
            h6 {
              font-weight: 700;
            }
          }
          .content-intro {
            text-align: center;
            span {
              margin-left: 8px;
            }
          }
          .oddle-privacy {
            .oddle-logo {
              border-right: 1px solid #d6d6d6;
              height: 32px;
            }
            span {
              padding-left: 4px;
              font-size: 12px;
              @extend .color-393939;
              a {
                text-decoration: underline;
                cursor: pointer;
                @extend .color-393939;
              }
            }
          }
          .underline-span {
            text-decoration: underline;
            cursor: pointer;
          }
          .custom-input-password :global(.MuiOutlinedInput-root) {
            background-color: white;
          }
          .color-393939 {
            color: #393939;
          }
        }
      `}</style>
    </div>
  );
}

export default CreateAsGuest;
