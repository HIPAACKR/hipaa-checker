import { useEffect, useState } from 'react';

const useIsSpDevice = () => {
  const [isSpDevice, setIsSpDevice] = useState(false);

  useEffect(() => {
    const checkDeviceWidth = () => {
      const width = window.innerWidth;
      setIsSpDevice(width < 1366);
    };

    checkDeviceWidth();
    window.addEventListener('resize', checkDeviceWidth);

    return () => {
      window.removeEventListener('resize', checkDeviceWidth);
    };
  }, []);

  return isSpDevice;
};

export default useIsSpDevice;
