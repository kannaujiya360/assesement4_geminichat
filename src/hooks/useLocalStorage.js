
import { useState } from 'react';

export default function useLocalStorage(key, initialValue) {
  const stored = localStorage.getItem(key);
  const [value, setValue] = useState(
    stored ? JSON.parse(stored) : initialValue
  );

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}
