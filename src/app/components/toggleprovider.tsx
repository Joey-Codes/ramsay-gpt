'use client'

import React, { ReactNode, createContext, useState } from 'react';

interface ToggleContextType {
    isToggled: boolean;
    toggleTheme: () => void;
}

export const ToggleContext = createContext<ToggleContextType>({
    isToggled: false,
    toggleTheme: () => {},
});

const ToggleContextProvider: React.FC<{children: ReactNode }> = ({ children }) => {
    const [isToggled, setIsToggled] = useState(false);

    const toggleTheme = () => {
        setIsToggled(!isToggled);
    };

    return (
        <ToggleContext.Provider value={{ isToggled, toggleTheme }}>
            {children}
        </ToggleContext.Provider>
    );
};

export default ToggleContextProvider;