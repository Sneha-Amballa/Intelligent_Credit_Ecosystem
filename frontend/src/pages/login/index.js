import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import "./style.css";

import { login as backendLogin } from "@/api/userService";

function LoginPage() {
  const [errorMessage, setErrorMessage] = useState("");

  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
  });

  const { login } = useAuth();
  const router = useRouter();

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage("Loading...");
      const response = await backendLogin(loginData);
      setErrorMessage("");

      if (response.success) {
        login(response.user.username);
        router.push("/dashboard");
      }
    } catch (error) {
      setErrorMessage("Error during login: " + error.response.data.message);
    }
  };

  return (
    <div className="loginContainer">
      <form onSubmit={handleLogin}>
        <div className="backgroundContainerL">
          <div className="containerL">
            <div className="loginheader">
              <div className="logintext">Login</div>
              <div className="underline"></div>
            </div>
            <div className="inputsL">
              <div className="inputL">
                <input
                  type="text"
                  placeholder="Username/Email"
                  name="login"
                  value={loginData.login}
                  onChange={handleInputChange}
                  autoComplete="username"
                  aria-label="Username or Email"
                />
              </div>
              <div className="inputL">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  aria-label="Password"
                />
              </div>
            </div>
            <p>{errorMessage}</p>
            <div className="newUser-buttons">
              <div className="new-user">Don&apos;t have an account?</div>
              <div className="submit-containerL">
                <button className="button-empty" onClick={handleLogin}>
                  <div className="loginButtonL">Login</div>
                </button>
                <Link href="/register" passHref legacyBehavior>
                  <a className="registerButtonL">Register</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
