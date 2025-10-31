import React, { useEffect } from "react";
import { register } from "../../api/userService";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "../register/style.css";
import CountrySelect from "@/components/Register/CountrySelect";
import LanguageSelect from "@/components/Register/LanguageSelect";
import { useAuth } from "@/context/AuthProvider";

function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const [registerData, setRegisterData] = React.useState({
    username: "",
    email: "",
    password: "",
    dateOfBirth: "",
    countryOfOrigin: { label: "" },
    preferredLanguage: { label: "" },
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);

  useEffect(() => {
    if (
      registerData.email.length > 0 &&
      registerData.password.length > 0 &&
      registerData.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [registerData]);

  const handleInputChange = (e) => {
    setErrorMessage("");

    if (e.target) {
      setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    } else {
      setRegisterData({ ...registerData, [e.name]: e.value });
    }
  };

  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !registerData.dateOfBirth ||
      !registerData.countryOfOrigin ||
      !registerData.preferredLanguage
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    registerData.countryOfOrigin = registerData.countryOfOrigin.label;
    registerData.preferredLanguage = registerData.preferredLanguage.label;

    try {
      setErrorMessage("Loading...");

      const response = await register(registerData);
      setErrorMessage("");

      if (response.success) {
        login(response.user.username);
        router.push("/dashboard");
      }
    } catch (error) {
      registerData.countryOfOrigin = { label: "" };
      registerData.preferredLanguage = { label: "" };

      setErrorMessage(error.response.data.message + "! Please try again.");
    }
  };

  return (
    <div className="Register-container">
      <form onSubmit={handleRegister}>
        <div className="backgroundContainer">
          <div className="container">
            <div className="header">
              <div className="text">Register</div>
              <div className="underline"></div>
            </div>
            <div className="inputs">
              <div className="registerinput">
                <input
                  required
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={registerData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="registerinput">
                <input
                  required
                  type="email"
                  placeholder="E-mail"
                  name="email"
                  value={registerData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="registerinput">
                <input
                  required
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={registerData.password}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of Birth"
                    value={registerData.dateOfBirth}
                    onChange={(newValue) =>
                      setRegisterData({
                        ...registerData,
                        dateOfBirth: newValue,
                      })
                    }
                    textField={(params) => <TextField {...params} />}
                    style={{ width: "100px", height: "40px" }}
                  />
                </LocalizationProvider>
              </div>

              <div className="input2">
                <CountrySelect
                  placeholder="Country of Origin"
                  name="countryOfOrigin"
                  value={registerData.countryOfOrigin}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input2">
                <LanguageSelect
                  placeholder="Preferred Language"
                  name="preferredLanguage"
                  value={registerData.preferredLanguage}
                  onChange={handleInputChange}
                />
              </div>
              <p>{errorMessage}</p>
              <div className="oldUser-buttons">
                <div className="old-user">Already have an account?</div>
                <div className="submit-container">
                  <Link href="/login" passHref legacyBehavior>
                    <a className="loginButton noUnderline">Login</a>
                  </Link>
                  <button className="button-empty" type="submit">
                    <div className="registerButton">Register</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
