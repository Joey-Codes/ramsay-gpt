'use client'

import React, { ReactNode, createContext, useState } from 'react';

interface SidebarContextType {
    selectedChatIndex: number;
    changeConvo: (index: number) => void;
    activeButton: number;
    changeActive: (index: number) => void;
    isHidden: boolean;
    toggleHidden: () => void;
}

export const SidebarContext = createContext<SidebarContextType>({
    selectedChatIndex: 0,
    changeConvo: () => {},
    activeButton: -1,
    changeActive: () => {},
    isHidden: true,
    toggleHidden: () => {},
});

const SidebarContextProvider: React.FC<{children: ReactNode }> = ({ children }) => {
    const [selectedChatIndex, setSelectedChatIndex] = useState(0);
    const [activeButton, setActiveButton] = useState(-1);
    const [isHidden, setIsHidden] = useState(true);

    const changeConvo = (index: number) => {
        setSelectedChatIndex(index);
    };

    const changeActive = (index: number) => {
        setActiveButton(index);
    };

    const toggleHidden = () => {
        setIsHidden(prevIsHidden => !prevIsHidden);
    };


    return (
        <SidebarContext.Provider value={{ selectedChatIndex, changeConvo, activeButton, changeActive, isHidden, toggleHidden}}>
            {children}
        </SidebarContext.Provider>
    );
};

export default SidebarContextProvider;