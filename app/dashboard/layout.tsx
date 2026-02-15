'use client';

import Sidebar from '@/components/Sidebar';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';

function DashboardShell({ children }: { children: React.ReactNode }) {
    const { currentView, setCurrentView, sidebarOpen, setSidebarOpen } = useDashboard();

    return (
        <div className="flex h-screen w-full bg-[var(--bg-page)] overflow-hidden">
            <Sidebar
                currentView={currentView}
                onViewChange={setCurrentView}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <main className="flex flex-1 flex-col min-h-0 overflow-hidden md:ml-[280px]">
                {children}
            </main>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardProvider>
            <DashboardShell>{children}</DashboardShell>
        </DashboardProvider>
    );
}
