
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../store/slices/themeSlice';
import { Sun, Moon } from 'lucide-react';

function ThemeToggle() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:scale-105 transition"
      title="Toggle Theme"
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

export default ThemeToggle;
