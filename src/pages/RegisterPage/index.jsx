import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister, isAuthSelector } from "../../redux/slices/authSlice";
import styles from "./RegisterPage.module.css";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(isAuthSelector);
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    role: "",
    department: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    if (name === "role" && value !== "manager") {
      setFormValues((prev) => ({ ...prev, department: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormErrors({ email: "", password: "", role: "" });

    const data = await dispatch(fetchRegister(formValues));

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
      alert("Registration successful!");
    } else {
      alert("An error occurred during registration.");
    }
  };

  if (isAuth) {
    navigate("/login");
  }

  return (
    <div>
      <div className={styles.container} id="registrationContainer">
        <h2>Rejestracja</h2>
        <form id="registrationForm" onSubmit={handleSubmit}>
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

          <label htmlFor="role">Wybierz rolę:</label>
          <select
            id="role"
            name="role"
            value={formValues.role}
            onChange={handleChange}
            required
          >
            <option value="">-- Wybierz --</option>
            <option value="worker">Pracownik</option>
            <option value="manager">Kierownik</option>
          </select>
          {formErrors.role && (
            <span className={styles.error}>{formErrors.role}</span>
          )}

          {formValues.role === "manager" && (
            <div id="departmentSection">
              <label htmlFor="department">Wybierz dział:</label>
              <select
                id="department"
                name="department"
                value={formValues.department}
                onChange={handleChange}
              >
                <option value="">-- Wybierz --</option>
                <option value="marketing">Marketing</option>
                <option value="legal">Prawnicy</option>
                <option value="advocacy">Adwokaci</option>
              </select>
            </div>
          )}

          <button type="submit">Zarejestruj się</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
