<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\Support\PermissionCatalog;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();
        foreach (PermissionCatalog::all() as $name) {
            Permission::findOrCreate($name, 'web');
        }

        $superUser = Role::firstOrCreate(
            ['name' => 'super user', 'guard_name' => 'web'],
            ['passcode' => env('SEED_SUPER_USER_PASSCODE', 'demo-passcode')],
        );
        $superUser->syncPermissions(PermissionCatalog::all());

        $user = User::role('super user')->first() ?? User::create();
        $user->assignRole($superUser);
    }
}
