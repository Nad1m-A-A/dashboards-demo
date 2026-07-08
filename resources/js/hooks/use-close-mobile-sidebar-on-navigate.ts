import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useSidebar } from '@/components/ui/sidebar';

export function useCloseMobileSidebarOnNavigate(): void {
    const { setOpenMobile } = useSidebar();

    useEffect(() => {
        return router.on('start', () => {
            setOpenMobile(false);
        });
    }, [setOpenMobile]);
}
