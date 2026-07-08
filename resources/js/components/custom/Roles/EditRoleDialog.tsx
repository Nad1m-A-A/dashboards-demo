import { Form } from "@inertiajs/react"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { RoleWizard } from "@/components/custom/Roles/RoleWizard"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { update } from "@/routes/roles-and-permissions"
import type { Role } from "@/types/auth"
import type { PermissionGroups } from "@/types/ui"

export function EditRoleDialog({ role, permissionGroups }: { role: Role, permissionGroups: PermissionGroups }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon"><Pencil className="size-4" /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Role</DialogTitle>
                </DialogHeader>
                <Form
                    {...update.form({ role: role.id })}
                    options={{ preserveScroll: true }}
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <RoleWizard
                            permissionGroups={permissionGroups}
                            processing={processing}
                            errors={errors}
                            fieldName="dialog-permissions[]"
                            initialName={role.name}
                            initialSelectedNames={role.permissions.map((permission) => permission.name)}
                            submitLabel="Save changes"
                            secondaryAction={
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" className="bg-card">Cancel</Button>
                                </DialogClose>
                            }
                        />
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    )
}
