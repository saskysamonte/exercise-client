import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm, Controller, useFormState } from "react-hook-form";
import Cookies from "js-cookie";
import classes from "./LoginRegister.module.css";

export default function Register() {
  const navigate = useNavigate();
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      login: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = useFormState({ control });
  const [registerMessage, setRegisterMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async ({ login, password }) => {
    setRegisterMessage("");

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_USER_REGISTER,
        { login, password, confirm_password: confirmPassword },
      );

      // Store tokens in cookies upon successful registration
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

      navigate("/profile"); // Redirect to profile page after successful registration
    } catch (error) {
      console.error("Error registering:", error);
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed. Please try again.";
      setRegisterMessage(serverMessage);
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

        <form className={classes.loginPageForm} onSubmit={handleSubmit(onSubmit)}>
          <div className={classes.fieldRow}>
            <label htmlFor="login">User ID*</label>
            <div className={classes.inputWrapper}>
              <Controller
                name="login"
                control={control}
                render={({ field }) => (
                  <input
                    type="text"
                    placeholder="Enter your User ID"
                    {...field}
                  />
                )}
              />
              {errors.login && <p className={classes.errorMessage}>{errors.login.message}</p>}
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
              {errors.password && (
                <p className={classes.errorMessage}>{errors.password.message}</p>
              )}
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

          <div className={classes.fieldRow}>
            <label htmlFor="confirmPassword">Confirm Password*</label>
            <div className={classes.inputWrapper}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    autoComplete="on"
                    {...field}
                  />
                )}
              />
              {errors.confirmPassword && (
                <p className={classes.errorMessage}>{errors.confirmPassword.message}</p>
              )}
              <span
                className="material-icons"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {showConfirmPassword ? "visibility_off" : "visibility"}
              </span>
            </div>
          </div>

          <div className={classes.fieldButton}>
            <button type="submit" title="Register" disabled={isSubmitting}>
              {isSubmitting ? "loading..." : "Register"}
            </button>
          </div>

          <div className={classes.fieldRowLink}>
            <label htmlFor="password">Already have an account?</label>
            <a href="/login" id="password" className={classes.registerLink}>
              Login Now
            </a>
          </div>
        </form>

        {/* Display the error message if any */}
        {registerMessage && (
          <div className={registerMessage ? classes.loginErrorMessage : ""}>
            <p>{registerMessage}</p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
