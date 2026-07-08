import { Head } from '@inertiajs/react';
import CreateRole from '@/components/custom/Roles/CreateRole';
import RolesTable from '@/components/custom/Roles/RolesTable';
import { Separator } from '@/components/ui/separator';
import { rolesAndPermissions } from '@/routes';

export default function RolesAndPermissions() {
    return (
        <div className="p-4 space-y-6">
            <Head title="Roles & Permissions" />
            <CreateRole />
            <Separator />
            <RolesTable />
        </div>
    );
}

RolesAndPermissions.layout = {
    breadcrumbs: [
        {
            title: 'Roles & Permissions',
            href: rolesAndPermissions.url(),
        },
    ],
};

