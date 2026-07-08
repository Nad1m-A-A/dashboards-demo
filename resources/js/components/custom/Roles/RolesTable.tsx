import { Form, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatPermissionLabel } from '@/lib/format-permission-label';
import { destroy } from '@/routes/roles-and-permissions';
import type { PageProps } from '@/types/ui';
import { EditRoleDialog } from './EditRoleDialog';

function RolesTable() {
    const { roles, permissionGroups, flash, sessions } = usePage<PageProps>().props;

    return (
        <div className="space-y-4">
            {(flash.delete_success || flash.update_success) && (
                <p className="text-green-500">{flash.delete_success || flash.update_success}</p>
            )}
            {(flash.delete_error || flash.update_error) && (
                <p className="text-red-500">{flash.delete_error || flash.update_error}</p>
            )}

            <div className="overflow-hidden rounded-md border w-full">
                <Table className="min-h-[189px] min-w-[800px]">
                    <TableHeader style={{ backgroundColor: '#222222' }}>
                        <TableRow>
                            <TableHead className="text-white">Name</TableHead>
                            <TableHead className="text-white">Permissions</TableHead>
                            <TableHead className="text-white">Sessions</TableHead>
                            <TableHead className="text-white">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-card">
                        {roles.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell className="capitalize">{role.name}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2 flex-wrap max-w-sm">
                                        {role.permissions.map((permission) => (
                                            <Badge key={permission.id}>
                                                {formatPermissionLabel(permission.name)}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="capitalize">
                                    {sessions.reduce(
                                        (acc, session) =>
                                            session.user_id === role.id ? acc + 1 : acc,
                                        0,
                                    )}
                                </TableCell>
                                <TableCell>
                                    {role.name === 'super user' ? (
                                        <div className="flex gap-2">
                                            <Button variant="destructive" size="icon" disabled>
                                                <Trash2 className="size-4" />
                                            </Button>
                                            <Button variant="outline" size="icon" disabled>
                                                <Pencil className="size-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Form
                                                {...destroy.form({ role: role.id })}
                                                options={{ preserveScroll: true }}
                                            >
                                                {({ processing }) => (
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        disabled={processing}
                                                        onClick={(e) => {
                                                            if (!confirm(`Delete "${role.name}"?`)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                )}
                                            </Form>
                                            <EditRoleDialog role={role} permissionGroups={permissionGroups} />
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default RolesTable;