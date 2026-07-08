<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ExternalAPIs extends Controller
{
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

        $url = config("businesses.urls.$businessName");
        $key = config("businesses.keys.$businessName");
        $endpoint = config("businesses.endpoints.$endpointName");
        $res = Http::timeout(30)->withHeaders([
            'Authorization' => $key,
            'Accept' => 'application/json',
        ])->get($url . $endpoint);

        if ($res->successful()) {
            return $res->json();
        }

        // logger()->error('External API request failed', [
        //     'businessName' => $businessName,
        //     'endpointName' => $endpointName,
        //     'url' => $url,
        //     'key' => $key,
        //     'endpoint' => $endpoint,
        //     'response' => $res->body(),
        // ]);

        return response()->json(['message' => $res->body()], 502);
    }
}
