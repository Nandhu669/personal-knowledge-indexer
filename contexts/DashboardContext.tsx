'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ViewType } from '@/components/Sidebar';

interface DashboardContextType {
    currentView: ViewType;
    setCurrentView: (view: ViewType) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [currentView, setCurrentView] = useState<ViewType>(() => {
        if (typeof window === 'undefined') return 'dashboard';
        const saved = sessionStorage.getItem('pki-current-view') as ViewType | null;
        return saved || 'dashboard';
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        sessionStorage.setItem('pki-current-view', currentView);
    }, [currentView]);

    return (
        <DashboardContext.Provider
            value={{
                currentView,
                setCurrentView,
                sidebarOpen,
                setSidebarOpen,
                toggleSidebar: () => setSidebarOpen((p) => !p),
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const ctx = useContext(DashboardContext);
    if (!ctx) {
        throw new Error('useDashboard must be used inside DashboardProvider');
    }
    return ctx;
}
