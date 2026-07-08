<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    protected $hidden = [
        'passcode',
    ];

    protected function casts(): array
    {
        return [
            'passcode' => 'hashed',
        ];
    }
}