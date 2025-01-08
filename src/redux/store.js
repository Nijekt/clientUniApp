import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
// import postsSlice from "./slices/postsSlice";
import userSlice from "./slices/userSlice";

const store = configureStore({
  reducer: { auth: authSlice, user: userSlice },
});

export default store;
