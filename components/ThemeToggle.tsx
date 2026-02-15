'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'motion/react';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="p-2 w-9 h-9" />;
    }

    const isDark = theme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="relative p-2 rounded-lg bg-transparent hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
            aria-label="Toggle theme"
        >
            <div className="relative w-5 h-5 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                        <motion.div
                            key="moon"
                            initial={{ y: 20, opacity: 0, rotate: 40 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            exit={{ y: -20, opacity: 0, rotate: -40 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="absolute inset-0 flex items-center justify-center text-[#3b82f6]"
                        >
                            <Moon className="w-5 h-5" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ y: 20, opacity: 0, rotate: 40 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            exit={{ y: -20, opacity: 0, rotate: -40 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="absolute inset-0 flex items-center justify-center text-[#f59e0b]"
                        >
                            <Sun className="w-5 h-5" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </button>
    );
}
