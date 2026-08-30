import { useEffect, useState } from 'react';

const useLocalStorage = (key) => {
  const [storedValue, setStoredValue] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(key);
        setStoredValue(item ? JSON?.parse(item) : null);
      } catch (error) {
        setStoredValue(null);
      }
    }
  }, [key]);

  const removeItem = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key);
        setStoredValue(null);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error removing item from localStorage:', error);
      }
    }
  };

  return [storedValue, removeItem];
};

export default useLocalStorage;
