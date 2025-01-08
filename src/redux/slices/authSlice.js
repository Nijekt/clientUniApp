import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",
  async (params) => {
    const { data } = await axios.post("api/register", params);
    return data;
  }
);
export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
  const { data } = await axios.get("api/AuthMe");
  console.log(data);
  return data;
});
export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (params) => {
  const { data } = await axios.post("api/login", params);
  return data;
});
const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRegister.pending, (state) => {
      state.data = null;
      state.status = "loading";
    });
    builder.addCase(fetchRegister.fulfilled, (state, action) => {
      // state.data = action.payload;
      // state.status = "loaded";
      if (action.payload.token) {
        state.data = action.payload;
        state.status = "loaded";
      } else {
        state.data = null;
        state.status = "error";
      }
    });
    builder.addCase(fetchRegister.rejected, (state, action) => {
      state.data = null;
      state.status = "error";
    });
    builder.addCase(fetchAuth.pending, (state) => {
      state.data = null;
      state.status = "loading";
    });
    builder.addCase(fetchAuth.fulfilled, (state, action) => {
      if (action.payload.token) {
        state.data = action.payload;
        state.status = "loaded";
      } else {
        state.data = null;
        state.status = "error";
      }
    });
    builder.addCase(fetchAuth.rejected, (state, action) => {
      state.status = "error";
    });
    builder.addCase(fetchAuthMe.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchAuthMe.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    });
    builder.addCase(fetchAuthMe.rejected, (state, action) => {
      state.status = "error";
    });
  },
});

export const isAuthSelector = (state) => Boolean(state.auth.data);

export const { logout } = authSlice.actions;

export default authSlice.reducer;
