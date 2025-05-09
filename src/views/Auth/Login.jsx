import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm, Controller, useFormState } from "react-hook-form";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import classes from "./LoginRegister.module.css";

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
  const [loginMessage, setLoginMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = Cookies.get("app-is-logged-in");
    const storedLogin = Cookies.get("remembered-login");
    const storedPassword = Cookies.get("remembered-password");
    const expiration = Cookies.get("remembered-expires");

    if (isLoggedIn === "true") {
      navigate("/profile");
      return;
    }

    // Handle remembered login credentials
    if (storedLogin && storedPassword && expiration) {
      const now = Date.now();
      if (now < parseInt(expiration, 10)) {
        const decryptedLogin = decryptData(storedLogin);
        const decryptedPassword = decryptData(storedPassword);
        setValue("login", decryptedLogin);
        setValue("password", decryptedPassword);
        setValue("rememberMe", true);
      } else {
        // Clear expired cookies
        Cookies.remove("remembered-login");
        Cookies.remove("remembered-password");
        Cookies.remove("remembered-expires");
      }
    }
  }, [navigate, setValue]);

  const encryptData = (data) => CryptoJS.AES.encrypt(data, SALT_KEY).toString();

  const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SALT_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const onSubmit = async ({ login, password, rememberMe }) => {
    setLoginMessage("");  // Reset login message on submit

    if (!login || !password) {
      setLoginMessage("Please enter your User ID and password");
      return;
    }

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_USER_LOGIN,
        { login, password },
      );

      // Save tokens in cookies
      Cookies.set("app-access-token", response.data.accessToken, {
        expires: 1 / 24, // 1 hour
        path: "/",
        secure: true,
        sameSite: "Strict",
      });

      Cookies.set("app-refresh-token", response.data.refreshToken, {
        expires: 1, // 1 day
        path: "/",
        secure: true,
        sameSite: "Strict",
      });

      Cookies.set("app-is-logged-in", "true", {
        expires: 1 / 24, // 1 hour
        path: "/",
        secure: true,
        sameSite: "Strict",
      });

      // Store login details for 'remember me' functionality
      if (rememberMe) {
        const oneYearFromNow = Date.now() + 365 * 24 * 60 * 60 * 1000; // 1 year in ms
        Cookies.set("remembered-login", encryptData(login), {
          expires: 365,
          path: "/",
          secure: true,
          sameSite: "Strict",
        });
        Cookies.set("remembered-password", encryptData(password), {
          expires: 365,
          path: "/",
          secure: true,
          sameSite: "Strict",
        });
        Cookies.set("remembered-expires", oneYearFromNow, {
          expires: 365,
          path: "/",
          secure: true,
          sameSite: "Strict",
        });
      } else {
        // Clear remembered login details if not selected
        Cookies.remove("remembered-login");
        Cookies.remove("remembered-password");
        Cookies.remove("remembered-expires");
      }

      navigate("/profile");
    } catch (error) {
      console.error("Error logging in:", error);
      
      // Handle specific error messages
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed. Please try again.";
      
      // Show error message based on the response
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
                  <input type="text" placeholder="Enter your User ID" {...field} />
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
                    placeholder="Enter your password"
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
