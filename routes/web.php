<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\RolesAndPermissionsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    // ? Frontend Operations
    Route::redirect('/', '/user-guide');
    Route::inertia('/stats', 'stats')->middleware('permission:stats.view')->name('stats');
    Route::inertia('/property-types', 'property-types')->middleware('permission:property types.view')->name('property-types');
    Route::inertia('/agents', 'agents')->middleware('permission:agents.view')->name('agents');
    Route::inertia('/deals', 'deals')->middleware('permission:deals.view')->name('deals');
    Route::inertia('/property-services', 'property-services')->middleware('permission:property services.view')->name('property-services');
    Route::inertia('/sales-teams', 'sales-teams')->middleware('permission:sales teams.view')->name('sales-teams');
    Route::inertia('/user-guide', 'user-guide')->name('user-guide');
    Route::inertia('/developer-guide', 'developer-guide')->middleware('permission:developer guide.view')->name('developer-guide');

    Route::get('/roles-and-permissions', [RolesAndPermissionsController::class, 'index'])->middleware('permission:roles and permissions.view')->name('roles-and-permissions');
    Route::get('/activity-log', [ActivityLogController::class, 'index'])->middleware('permission:activity log.view')->name('activity-log');

    // ? Database Operations
    Route::post('roles-and-permissions', [RolesAndPermissionsController::class, 'store'])->middleware('permission:roles and permissions.create')->name('roles-and-permissions.store');
    Route::delete('roles-and-permissions/{role}', [RolesAndPermissionsController::class, 'destroy'])->middleware('permission:roles and permissions.delete')->name('roles-and-permissions.destroy');
    Route::patch('roles-and-permissions/{role}', [RolesAndPermissionsController::class, 'update'])->middleware('permission:roles and permissions.update')->name('roles-and-permissions.update');
});
