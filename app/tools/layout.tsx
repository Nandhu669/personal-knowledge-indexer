'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import Sidebar, { ViewType } from '@/components/Sidebar';

export default function ToolsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentView] = useState<ViewType>('dashboard');

    const handleViewChange = (view: ViewType) => {
        sessionStorage.setItem('pki-current-view', view);
        router.push('/dashboard');
    };

    return (
        <div className="flex h-screen w-full bg-[var(--bg-page)] overflow-hidden">
            <Sidebar
                currentView={currentView}
                onViewChange={handleViewChange}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex flex-1 flex-col min-h-0 overflow-auto md:ml-[290px]">
                <div className="md:hidden sticky top-0 z-30 bg-white border-b border-[var(--border-default)] px-4 py-3">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-[var(--radius-sm)] p-2 text-[#5f7594] hover:bg-[#eef2f8]"
                        aria-label="Open sidebar"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
                <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
                    {children}
                </div>
            </main>
        </div>
    );
}
