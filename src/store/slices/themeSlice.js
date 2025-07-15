// src/store/slices/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Ensure valid theme from localStorage (fallback to false)
const savedTheme = localStorage.getItem('theme');
const initialState = {
  darkMode: savedTheme ? savedTheme === 'dark' : false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
    },
    setDarkMode(state, action) {
      // Optional: force theme based on passed value
      state.darkMode = action.payload;
      localStorage.setItem('theme', action.payload ? 'dark' : 'light');
    }
  },
});

export const { toggleTheme, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
