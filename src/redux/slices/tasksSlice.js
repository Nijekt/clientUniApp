import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios.js";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const { data } = await axios.get("api/tasks");
  console.log(data);

  return data;
});

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ id, status }) => {
    const { data } = await axios.patch(`/api/changeStatus/${id}`, { status });
    return data;
  }
);

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id) => {
  await axios.delete(`/api/deleteTask/${id}`);
  return id;
});

const initialState = {
  tasks: {
    items: [],
    status: "loading",
  },
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state, action) => {
      state.tasks.status = "loading";
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks.status = "loaded";
      state.tasks.items = action.payload;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.tasks.status = "error";
      state.tasks.items = action.payload;
    });
    builder.addCase(updateTaskStatus.fulfilled, (state, action) => {
      const updatedTask = action.payload;
      const index = state.tasks.items.findIndex(
        (task) => task._id === updatedTask._id
      );

      if (index !== -1) {
        state.tasks.items[index] = {
          ...state.tasks.items[index],
          status: updatedTask.status,
        };
      }
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      const id = action.payload;
      state.tasks.items = state.tasks.items.filter((task) => task._id !== id);
    });
  },
});

export default tasksSlice.reducer;
