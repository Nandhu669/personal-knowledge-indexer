'use client';

import * as React from "react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import {
  Archive,
  Database,
  Folder,
  LayoutDashboard,
  LogOut,
  Settings,
  Star,
  X,
} from 'lucide-react';
import { ThemeToggle } from "@/components/ThemeToggle";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

export type ViewType = 'dashboard' | 'favorites' | 'categories' | 'archived' | 'settings';

const navItems: { label: string; view: ViewType; icon: any }[] = [
  { label: 'Dashboard', view: 'dashboard', icon: LayoutDashboard },
  { label: 'Favorites', view: 'favorites', icon: Star },
  { label: 'Categories', view: 'categories', icon: Folder },
  { label: 'Archived', view: 'archived', icon: Archive },
];

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

interface UserSummary {
  name: string;
  email: string;
}

function resolveUserSummary(user: {
  email?: string;
  user_metadata?: { full_name?: string; name?: string };
} | null): UserSummary {
  const email = user?.email || '';
  const metadataName = user?.user_metadata?.full_name || user?.user_metadata?.name || '';
  const emailPrefix = email.includes('@') ? email.split('@')[0] : '';
  const name = metadataName || emailPrefix || 'User';

  return {
    name,
    email: email || 'user@example.com',
  };
}

export default function AppSidebar({ currentView, onViewChange }: SidebarProps) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const supabase = React.useMemo(() => createClient(), []);
  const [userInfo, setUserInfo] = React.useState<UserSummary>({ name: 'User', email: 'user@example.com' });

  React.useEffect(() => {
    let ignore = false;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (ignore) return;
      setUserInfo(resolveUserSummary(data.user));
    };

    loadUser();
    return () => {
      ignore = true;
    };
  }, [supabase]);

  const avatarInitial = React.useMemo(() => {
    const raw = userInfo.name || userInfo.email || 'U';
    return raw.trim().charAt(0).toUpperCase() || 'U';
  }, [userInfo.name, userInfo.email]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-sidebar/50 backdrop-blur-xl">
      <SidebarHeader className="h-16 flex items-center justify-between px-4 border-b border-border/50">
        <div className="flex items-center justify-between w-full">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setOpenMobile(false)}>
            <div className="flex bg-primary/10 p-1.5 rounded-lg">
              <Database className="w-5 h-5 text-primary" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">PKI</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpenMobile(false)}
              className="md:hidden p-1.5 rounded-md text-muted-foreground hover:bg-muted"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = currentView === item.view;
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.view}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => onViewChange(item.view)}
                      tooltip={item.label}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                      <span className="font-medium">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentView === 'settings'}
                  onClick={() => onViewChange('settings')}
                  tooltip="Settings"
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200",
                    currentView === 'settings'
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Settings className={cn("w-5 h-5", currentView === 'settings' ? "text-primary-foreground" : "text-muted-foreground")} />
                  <span className="font-medium">Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="h-9 w-9 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md">
            {avatarInitial}
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold text-foreground">{userInfo.name}</p>
            <p className="truncate text-xs text-muted-foreground">{userInfo.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="ml-auto h-8 w-8 text-muted-foreground hover:text-destructive group-data-[collapsible=icon]:hidden"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
