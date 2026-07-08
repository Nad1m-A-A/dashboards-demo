<?php

namespace App\Support;

class PermissionCatalog
{
    /**
     * @return list<string>
     */
    public static function all(): array
    {
        /** @var array<string, list<string>> $groups */
        $groups = config('permission.app-permissions');

        return array_values(array_merge(...array_values($groups)));
    }

    /**
     * @return array<string, list<string>>
     */
    public static function groups(): array
    {
        /** @var array<string, list<string>> */
        return config('permission.app-permissions');
    }
}
