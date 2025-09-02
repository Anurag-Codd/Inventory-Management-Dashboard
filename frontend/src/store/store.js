import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import widgetReducer from "./features/widgetSlice";
import { injectRedux } from "../utils/axiosInstance.js";
import api from "./api/index.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    widget: widgetReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

injectRedux(store);

export default store;
