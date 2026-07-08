<?php

namespace App\Http\Controllers;

use App\Services\DemoDataService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DemoExternalAPIs extends Controller
{
    public function __construct(public DemoDataService $demoData) {}

    public function retrieve(Request $request, string $businessName, string $endpointName): array|JsonResponse
    {
        $viewPermission = config("businesses.endpoint-permissions.{$endpointName}");

        if ($viewPermission === null) {
            abort(404);
        }

        $user = $request->user();

        if (! $user->can($businessName) || ! $user->can($viewPermission)) {
            abort(403);
        }

        return $this->demoData->retrieve($businessName, $endpointName);
    }
}
