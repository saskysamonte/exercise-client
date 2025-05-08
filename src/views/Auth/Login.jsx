import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm, Controller, useFormState } from "react-hook-form";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import classes from "./Login.module.css";

const SALT_KEY = process.env.REACT_APP_SALT_KEY;

export default function Login() {
  const navigate = useNavigate();
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      login: "",
      password: "",
      rememberMe: false,
    },
  });

  const { isSubmitting } = useFormState({ control });
  const [csrfToken, setCsrfToken] = useState(null);
  const [loginMessage, setLoginMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const isLoggedIn = Cookies.get("APP-IS-LOGGED-IN");
    const storedLogin = Cookies.get("REMEMBERED-LOGIN");
    const storedPassword = Cookies.get("REMEMBERED-PASSWORD");
    const expiration = Cookies.get("REMEMBERED-EXPIRES");

    if (isLoggedIn === "true") {
      navigate("/profile");
      return;
    }

    if (storedLogin && storedPassword && expiration) {
      const now = Date.now();
      if (now < parseInt(expiration, 10)) {
        const decryptedLogin = decryptData(storedLogin);
        const decryptedPassword = decryptData(storedPassword);
        setValue("login", decryptedLogin);
        setValue("password", decryptedPassword);
        setValue("rememberMe", true);
      } else {
        // Expired – clear cookie
        Cookies.remove("REMEMBERED-LOGIN");
        Cookies.remove("REMEMBERED-PASSWORD");
        Cookies.remove("REMEMBERED-EXPIRES");
      }
    }

    const fetchCsrfToken = async () => {
      try {
        const res = await axios.get(process.env.REACT_APP_API_USER_CSRF_TOKEN, {
          withCredentials: true,
        });
        setCsrfToken(res.data.csrfToken);
      } catch (error) {
        console.error("CSRF token fetch failed", error);
      }
    };
    fetchCsrfToken();
  }, [navigate, setValue]);

  const encryptData = (data) => CryptoJS.AES.encrypt(data, SALT_KEY).toString();

  const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SALT_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const onSubmit = async ({ login, password, rememberMe }) => {
    setLoginMessage("");
    if (!login || !password) {
      setLoginMessage("Please enter your User ID and password");
      return;
    }

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_USER_LOGIN,
        { login, password },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
      );

      Cookies.set("APP-ACCESS-TOKEN", response.data.accessToken, {
        expires: 1 / 24, // 1 hour
        path: "/",
        secure: true,
        sameSite: "Strict",
      });

      Cookies.set("APP-REFRESH-TOKEN", response.data.refreshToken, {
        expires: 1, // 1 day
        path: "/",
        secure: true,
        sameSite: "Strict",
      });

      Cookies.set("APP-IS-LOGGED-IN", "true", {
        expires: 1 / 24, // 1 hour
        path: "/",
        secure: true,
        sameSite: "Strict",
      });

      if (rememberMe) {
        const oneYearFromNow = Date.now() + 365 * 24 * 60 * 60 * 1000; // 1 year in ms
        Cookies.set("REMEMBERED-LOGIN", encryptData(login), {
          expires: 365,
          path: "/",
          secure: true,
          sameSite: "Strict",
        });
        Cookies.set("REMEMBERED-PASSWORD", encryptData(password), {
          expires: 365,
          path: "/",
          secure: true,
          sameSite: "Strict",
        });
        Cookies.set("REMEMBERED-EXPIRES", oneYearFromNow, {
          expires: 365,
          path: "/",
          secure: true,
          sameSite: "Strict",
        });
      } else {
        Cookies.remove("REMEMBERED-LOGIN");
        Cookies.remove("REMEMBERED-PASSWORD");
        Cookies.remove("REMEMBERED-EXPIRES");
      }
      navigate("/profile");
    } catch (error) {
      console.error("Error logging in:", error);
      // Attempt to extract a message from the server
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed. Please try again.";
      setLoginMessage(serverMessage);
    }
  };

  return (
    <React.Fragment>
      <div className={classes.loginPage}>
        <div className={classes.loginPageHeader}>
          <h2>
            Welcome to <span className={classes.highlight}>myApp</span>
          </h2>
        </div>

        <form
          className={classes.loginPageForm}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={classes.fieldRow}>
            <label htmlFor="login">User ID*</label>
            <div className={classes.inputWrapper}>
              <Controller
                name="login"
                control={control}
                render={({ field }) => (
                  <input type="text" className="" placeholder="" {...field} />
                )}
              />
            </div>
          </div>

          <div className={classes.fieldRow}>
            <label htmlFor="password">Password*</label>
            <div className={classes.inputWrapper}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder=""
                    autoComplete="on"
                    {...field}
                  />
                )}
              />
              <span
                className="material-icons"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </div>
          </div>

          <div className={classes.fieldRememberMe}>
            <label htmlFor="rememberMe">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
              Keep me logged in
            </label>
          </div>

          <div className={classes.fieldButton}>
            <button type="submit" title="Login" disabled={isSubmitting}>
              {isSubmitting ? "loading..." : "Login"}
            </button>
          </div>

          <div className={classes.fieldRowLink}>
            <label htmlFor="password">No account?</label>
            <a href="/register" id="password" className={classes.registerLink}>
              Register Now
            </a>
          </div>
        </form>
      </div>

      {loginMessage && (
        <div className={loginMessage ? classes.loginErrorMessage : ""}>
          <p>{loginMessage}</p>
        </div>
      )}
    </React.Fragment>
  );
}
