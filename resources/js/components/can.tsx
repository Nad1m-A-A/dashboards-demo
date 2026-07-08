import { usePermissions } from '@/hooks/use-permissions';

export function Can({ permission, children }: { permission: string; children: React.ReactNode }) {
    const { can } = usePermissions();

    return can(permission) ? <>{children}</> : null;
}