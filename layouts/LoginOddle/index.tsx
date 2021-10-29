import React, {useState, useEffect} from "react";
import {IconButton, InputAdornment} from "@material-ui/core";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import MyOutlinedInput from "@/components/Input/MyOutlinedInput";
import {REGEXS} from "@/common/constant/Regex";
import {
  IconTickWhite,
  OddlePassLogo,
  OddlePassLogoCustomerLogin,
} from "@/assets/img";
import CustomButtonNew from "@/components/Button/CustomButton";
import InlineNotification from "@/components/InlineNotification";
import {IAuthLogin, IUserCheckEmail} from "@/common/interface";
import authService from "@/services/auth.service";
import {RESERVE_APP_ID, RESERVE_APP_NAME} from "@/common/config";
import {BookingStoreProp, useBookingStore, UseBrandProp, useBrandStore} from "@/store/store";

interface IProps {
  hasCookie?: boolean;
  hasTokenWidget?: boolean;
  infoUser: IUserCheckEmail; // use after check email existed
  setIsOpacity?: (arg0: boolean) => void;
  dataUser: IAuthLogin;
  setDataUser: (arg0: IAuthLogin) => void;
  oddlePassId?: string;
}

function LoginOddle(props: IProps): JSX.Element {
  const {
    hasCookie,
    hasTokenWidget,
    infoUser,
    setIsOpacity,
    dataUser,
    setDataUser,
    oddlePassId,
  } = props;

  const brand = useBrandStore((state: UseBrandProp) => state.brand);
  const outlet = useBookingStore((state: BookingStoreProp) => state.outlet);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
  });
  const [isContinue, setIsContinue] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (hasTokenWidget && dataUser) {
      setEmail(dataUser?.email);
      setName(`${dataUser?.firstName} ${dataUser?.lastName}`);
      setIsContinue(true);
    }
  }, [hasTokenWidget]);

  useEffect(() => {
    if (infoUser) {
      setEmail(infoUser?.email);
      setName(`${infoUser?.firstName} ${infoUser?.lastName}`);
    }
  }, [infoUser]);

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setErrors(prev => ({...prev, password: ""}));
    setPassword(value);
  };

  const handleContinue = async () => {
    setIsContinue(true);
    if (setIsOpacity) setIsOpacity(false);
    const res = await authService.getAccessToken(oddlePassId as string);
    if (typeof res !== "string") {
      setDataUser(res);
      setIsLoginSuccess(true);
      window.analytics.identify(res?.oddlePassId, {
        firstName: res?.firstName,
        lastName: res?.lastName,
        email: res?.email,
        phone: res?.phone,
      });
      window.analytics.track("Signed In", {
        app: {
          id: RESERVE_APP_ID,
          name: RESERVE_APP_NAME,
        },
      });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (REGEXS.PASSWORD.test(password)) {
      setIsLoading(true);
      const login = await authService.login(
        email,
        password,
        brand?.countryCode,
        outlet?.id,
      );
      if (login && typeof login !== "string") {
        setIsLoginSuccess(true);
        setDataUser(login as unknown as IAuthLogin);
        window.analytics.identify(login?.oddlePassId, {
          firstName: login?.firstName,
          lastName: login?.lastName,
          email: login?.email,
          phone: login?.phone,
        });
        window.analytics.track("Signed In", {
          app: {
            id: RESERVE_APP_ID,
            name: RESERVE_APP_NAME,
          },
        });
        setTimeout(() => {
          setIsContinue(true);
          if (setIsOpacity) setIsOpacity(false);
        }, 1000);
      } else {
        setErrors(prev => ({...prev, password: "Password is invalid"}));
      }
      setIsLoading(false);
      return;
    }
    setErrors(prev => ({...prev, password: "Password is invalid"}));
  };

  const handleResetPassword = () => {
    authService.resetPass(email);
    setIsResetPassword(true);
  };

  return (
    <div className="login-oddle div-center">
      {isContinue ? (
        <div>
          <div className="logo-user div-center mb-20">
            <OddlePassLogoCustomerLogin scale={1.185} className="mr-16" />
            <div className="fs-16">
              <p className="user-name">{name}</p>
              <p className="color-393939">{email}</p>
              <p>{dataUser?.phone}</p>
            </div>
          </div>
          <div className="div-center oddle-privacy fs-12 continue-policy">
            <div className="oddle-logo">
              <OddlePassLogo className="mr-0" />
            </div>
            <span>
              Contact information auto-filled using your Oddle Pass account
              details.{" "}
              <a
                target="_blank"
                href="https://oddle.me/oddlepass/sg/"
                rel="noreferrer"
              >
                Learn more
              </a>
            </span>
          </div>
        </div>
      ) : (
        <div className="w-90">
          <div className="header-login mb-20">
            <h6 className="mb-16 fs-18">Log In with Oddle Pass</h6>
            <span className="color-393939 fs-14">
              We&apos;ll prefill your contact details when you log in.
            </span>
          </div>
          <div className="logo-user div-center mb-20">
            <OddlePassLogoCustomerLogin className="mr-16" />
            {/* <img src={ImageDefault.src} alt="Logo" className="mr-16" /> */}
            <div className="fs-16">
              <p className="user-name">{name}</p>
              <p className="color-393939">{email}</p>
            </div>
          </div>
          <div className="mb-20">
            {hasCookie ? (
              <CustomButtonNew
                type="primary"
                text={`Continue as ${dataUser?.firstName || "Example"}`}
                onClick={handleContinue}
              />
            ) : (
              <>
                <div className="custom-input-password">
                  <MyOutlinedInput
                    autoFocus
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
                    onKeyUp={ev => {
                      if (ev.key === "Enter" && password.length >= 8) {
                        handleLogin();
                      }
                    }}
                  />
                </div>
                <div className="mb-20 mt-20">
                  <CustomButtonNew
                    loading={isLoading}
                    type={isLoginSuccess ? "success" : "primary"}
                    text={isLoginSuccess ? "Successfully Logged In" : "Login"}
                    onClick={handleLogin}
                    endIcon={isLoginSuccess && <IconTickWhite />}
                  />
                </div>
                <div className="mb-20 forgot-password">
                  {isResetPassword ? (
                    <>
                      <InlineNotification
                        type="general"
                        content={
                          <span>
                            Reset password instructions have been sent to your
                            inbox. Didn’t receive the email?{" "}
                            <span
                              className="underline-span"
                              role="button"
                              tabIndex={0}
                              onClick={handleResetPassword}
                              onKeyPress={() => {}}
                            >
                              Send again
                            </span>
                          </span>
                        }
                      />
                    </>
                  ) : (
                    <>
                      <span>
                        Forgot Password?{" "}
                        <span
                          className="underline-span"
                          role="button"
                          tabIndex={0}
                          onClick={handleResetPassword}
                          onKeyPress={() => {}}
                        >
                          Reset Password
                        </span>
                      </span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="div-center oddle-privacy mb-20 fs-12">
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
          background-color: ${hasTokenWidget || isLoginSuccess
            ? "#fff"
            : "#f6f6f6"};
          color: black;
          border-radius: 6px;
          padding: ${hasTokenWidget || isLoginSuccess ? "0" : "0 16px"};
          .header-login {
            padding: 20px 0;
            border-bottom: 1px solid #d6d6d6;
            text-align: center;
            h6 {
              font-weight: 700;
            }
          }
          .logo-user {
            .user-name {
              font-weight: 500;
            }
            img {
              width: 48px;
              height: 48px;
              border-radius: 50%;
              border: 1px solid #d6d6d6;
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
          .forgot-password {
            text-align: center;
            font-size: 13px;
          }
          .color-393939 {
            color: #393939;
          }
          .continue-policy {
            background-color: #f6f6f6;
            padding: 16px 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default LoginOddle;
