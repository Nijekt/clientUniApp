import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuth, isAuthSelector } from "../../redux/slices/authSlice";
import styles from "./LoginPage.module.css";
import { Navigate, NavLink } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(isAuthSelector);

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormErrors({ email: "", password: "" });

    const data = await dispatch(fetchAuth(formValues));

    if (data.payload?.errors) {
      const errors = {};
      data.payload.errors.forEach((error) => {
        errors[error.path] = error.msg;
      });
      setFormErrors(errors);
      return;
    }

    if (data.payload && "token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
      alert("Login successful!");
    } else {
      alert("Invalid login credentials.");
    }
  };

  if (isAuth) {
    return <Navigate to={"/home"} />;
  }

  return (
    <div>
      <div className={styles.container} id="loginContainer">
        <h2>Logowanie</h2>
        <form id="loginForm" onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            required
          />
          {formErrors.email && (
            <span className={styles.error}>{formErrors.email}</span>
          )}

          <label htmlFor="password">Hasło:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            required
          />
          {formErrors.password && (
            <span className={styles.error}>{formErrors.password}</span>
          )}

          <button type="submit">Zaloguj się</button>
        </form>
      </div>
      <NavLink
        to={"/"}
        style={{ width: "460px", display: "block", margin: "0 auto" }}
      >
        <button>Rejestracja</button>
      </NavLink>
    </div>
  );
};

export default LoginPage;
