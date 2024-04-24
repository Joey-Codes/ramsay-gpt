'use client'

import React, { ReactNode, createContext, useState } from 'react';

interface SidebarContextType {
    selectedChatIndex: number;
    isHidden: boolean;
    toggleHidden: () => void;
    changeConvo: (index: number) => void;
}

export const SidebarContext = createContext<SidebarContextType>({
    selectedChatIndex: 0,
    isHidden: true,
    toggleHidden: () => {},
    changeConvo: () => {},
});

const SidebarContextProvider: React.FC<{children: ReactNode }> = ({ children }) => {
    const [isHidden, setIsHidden] = useState(true);
    const [selectedChatIndex, setSelectedChatIndex] = useState(0);

    const toggleHidden = () => {
        setIsHidden(prevIsHidden => !prevIsHidden);
    };

    const changeConvo = (index: number) => {
        setSelectedChatIndex(index);
    };

    return (
        <SidebarContext.Provider value={{ selectedChatIndex, isHidden, toggleHidden, changeConvo }}>
            {children}
        </SidebarContext.Provider>
    );
};

export default SidebarContextProvider;