import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useCloseMobileSidebarOnNavigate } from '@/hooks/use-close-mobile-sidebar-on-navigate';
import type { AppVariant } from '@/types';

function MobileSidebarNavigationHandler() {
    useCloseMobileSidebarOnNavigate();

    return null;
}

type Props = {
    children: ReactNode;
    variant?: AppVariant;
};

export function AppShell({ children, variant = 'sidebar' }: Props) {
    const isOpen = usePage().props.sidebarOpen;

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">{children}</div>
        );
    }

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <MobileSidebarNavigationHandler />
            {children}
        </SidebarProvider>
    );
}
