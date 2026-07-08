<?php

use App\Http\Controllers\DemoExternalAPIs;
use App\Http\Controllers\ExternalAPIs;
use Illuminate\Support\Facades\Route;

$externalApiController = config('app.demo')
    ? DemoExternalAPIs::class
    : ExternalAPIs::class;

// ? External API Operations
Route::middleware(['web', 'auth'])->group(function () use ($externalApiController) {
    Route::get('external/{businessName}/{endpointName}', [$externalApiController, 'retrieve'])
        ->name('external.retrieve');
});
