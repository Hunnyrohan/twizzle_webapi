'use client';

import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
    isPostModalOpen: boolean;
    openPostModal: () => void;
    closePostModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    const openPostModal = () => setIsPostModalOpen(true);
    const closePostModal = () => setIsPostModalOpen(false);

    return (
        <ModalContext.Provider value={{ isPostModalOpen, openPostModal, closePostModal }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}
