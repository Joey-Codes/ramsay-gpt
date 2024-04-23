import React, { createContext, useContext, useState, ReactNode } from 'react';
import styles from './toggle.module.css';
import { ToggleContext } from './toggleprovider';

const Toggle: React.FC = () => {
  const { isToggled, toggleTheme } = useContext(ToggleContext);

  const handleToggle = () => {
    toggleTheme();
  }

  return (
    <div className='d-flex align-items-center'>
      <p className={`fs-5 me-3 ms-2 mt-2 ${isToggled ? `text-white` : `text-black`}`}>{isToggled ? "Current Theme: Dark\u00A0" : "Current Theme: Light"}</p>
      <div className={styles.toggleContainer} onClick={handleToggle}>
        <div className={`${styles.toggle} ${isToggled ? styles.active : ''}`}></div>
      </div>
    </div>
  );
};

export default Toggle;
