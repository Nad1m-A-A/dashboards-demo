<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Models\Role;
use App\Models\User;
use App\Support\PermissionCatalog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsController extends Controller
{
    public function index(): Response
    {
        $permissions = Permission::query()
            ->whereIn('name', PermissionCatalog::all())
            ->get()
            ->keyBy('name');

        $permissionGroups = collect(PermissionCatalog::groups())
            ->map(fn (array $names): array => collect($names)
                ->map(fn (string $name) => $permissions->get($name))
                ->filter()
                ->values()
                ->all())
            ->all();

        return Inertia::render('roles-and-permissions', [
            'permissionGroups' => $permissionGroups,
            'roles' => Role::with('permissions')->get(),
            'sessions' => DB::table('sessions')->get(),
        ]);
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        try {
            $passcode = Str::random(10);
            DB::transaction(function () use ($request, $passcode) {
                $role = Role::create(['name' => $request->validated('name'), 'passcode' => $passcode]);
                $role->syncPermissions($request->validated('permissions'));
                User::create()->assignRole($role);
            });

            return back()->with('store_success', "Role created successfully. Passcode: {$passcode}");
        } catch (\Throwable $th) {
            return back()->with('store_error', $th->getMessage());
        }
    }

    public function destroy(Role $role): RedirectResponse
    {
        try {
            $role->delete();
            User::find($role->id)->delete();

            return back()->with('delete_success', 'Role deleted successfully');
        } catch (\Throwable $th) {
            return back()->with('delete_error', $th->getMessage());
        }
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        try {
            $role->update(['name' => $request->validated('name')]);
            $role->syncPermissions($request->validated('dialog-permissions'));

            return back()->with('update_success', 'Role updated successfully');
        } catch (\Throwable $th) {
            return back()->with('update_error', $th->getMessage());
        }
    }
}
