import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const determineSize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    determineSize(); 
    window.addEventListener('resize', determineSize);

    return () => window.removeEventListener('resize', determineSize);
  }, []);

  return isMobile;
};

