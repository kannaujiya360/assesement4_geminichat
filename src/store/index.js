import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import themeReducer from './slices/themeSlice';

// Debug logs
console.log("authReducer:", typeof authReducer);
console.log("chatReducer:", typeof chatReducer);
console.log("themeReducer:", typeof themeReducer);

const dummy = (state = {}) => state;

const store = configureStore({
  reducer: {
    auth: authReducer || dummy,
    chat: chatReducer || dummy,
    theme: themeReducer || dummy,
  },
});

export default store;
