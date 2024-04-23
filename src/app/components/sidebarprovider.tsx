'use client'

import React, { ReactNode, createContext, useState } from 'react';

interface SidebarContextType {
    isHidden: boolean;
    toggleHidden: () => void;
}

export const SidebarContext = createContext<SidebarContextType>({
    isHidden: true,
    toggleHidden: () => {},
});

const SidebarContextProvider: React.FC<{children: ReactNode }> = ({ children }) => {
    const [isHidden, setIsHidden] = useState(true);

    const toggleHidden = () => {
        setIsHidden(prevIsHidden => !prevIsHidden);
    }

    return (
        <SidebarContext.Provider value={{ isHidden, toggleHidden }}>
            {children}
        </SidebarContext.Provider>
    );
};

export default SidebarContextProvider;