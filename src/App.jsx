import "./App.css";
import { Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AddTasks from "./pages/AddTasks";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, isAuthSelector } from "./redux/slices/authSlice";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuthMe());
  });
  return (
    <>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<AddTasks />} />
      </Routes>
    </>
  );
}

export default App;
