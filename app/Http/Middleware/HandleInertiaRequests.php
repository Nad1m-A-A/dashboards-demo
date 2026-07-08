<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user()?->load('roles.permissions');
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? [
                    ...$user->withoutRelations()->toArray(),
                    'role' => $user->roles->first()?->only(['id', 'name', 'permissions']),
                ] : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                "store_success" => $request->session()->get('store_success'),
                "store_error" => $request->session()->get('store_error'),
                "update_success" => $request->session()->get('update_success'),
                "update_error" => $request->session()->get('update_error'),
                "delete_success" => $request->session()->get('delete_success'),
                "delete_error" => $request->session()->get('delete_error'),
            ],
        ];
    }
}
