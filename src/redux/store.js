import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
// import postsSlice from "./slices/postsSlice";
import userSlice from "./slices/userSlice";
import tasksSlice from "./slices/tasksSlice";

const store = configureStore({
  reducer: { auth: authSlice, user: userSlice, tasks: tasksSlice },
});

export default store;
