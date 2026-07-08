import { usePage } from '@inertiajs/react';

export function usePermissions() {
    const permissions = usePage().props.auth.user?.role?.permissions ?? [];
    const names = permissions.map((p) => p.name);
    const can = (permission: string) => names.includes(permission);
    const canAny = (list: string[]) => list.some(can);

    return { can, canAny, permissions: names };
}