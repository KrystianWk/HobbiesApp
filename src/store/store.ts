import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import hobbyReducer from "./slices/hobbySlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    hobby: hobbyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
