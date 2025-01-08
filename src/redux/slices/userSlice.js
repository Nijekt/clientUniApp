import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios.js";

export const fetchUser = createAsyncThunk("user/fetchUser", async (id) => {
  const { data } = await axios.get(`auth/getUser/${id}`);
  console.log("Getted user", data);
  return data;
});

const initialState = {
  data: null,
  status: "loading",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state, action) => {
      state.status = "loading";
      state.data = null;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.status = "error";
      state.data = action.payload;
    });
  },
});

export default userSlice.reducer;
