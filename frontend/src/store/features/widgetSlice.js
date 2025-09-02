import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchWidget = createAsyncThunk(
  "widget/fetchWidget",
  async (userId) => {
    try {
      const res = await axiosInstance.get(`/widgets/${userId}`);
      return res.data;
    } catch (error) {
      throw error.response.error;
    }
  }
);

export const updateWidget = createAsyncThunk(
  "widget/updateWidget",
  async ({ userId, home, statics }) => {
    try {
      const res = await axiosInstance.put(`/widgets/${userId}`, {
        home,
        statics,
      });
      return res;
    } catch (error) {
      error.response.error;
    }
  }
);

const widgetSlice = createSlice({
  name: "widget",
  initialState: {
    home: {
      overviewPosition: 1,
      summaryPosition: 2,
    },
    statics: {
      revenue: 1,
      sold: 2,
      inStock: 3,
    },
    error: null,
  },
  reducers: {
    setHomeOrder(state, action) {
      state.home = action.payload;
    },
    setStaticsOrder(state, action) {
      state.statics = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWidget.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchWidget.fulfilled, (state, action) => {
        state.home = action.payload.home || state.home;
        state.statics = action.payload.statics || state.statics;
      })
      .addCase(fetchWidget.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateWidget.fulfilled, (state, action) => {
        state.home = action.payload.home || state.home;
        state.statics = action.payload.statics || state.statics;
      });
  },
});

export const { setHomeOrder, setStaticsOrder } = widgetSlice.actions;

export default widgetSlice.reducer;
