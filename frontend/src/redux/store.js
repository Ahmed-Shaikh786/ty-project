import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import complaintReducer from './complaintSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    complaints: complaintReducer,
  },
});

export default store;
