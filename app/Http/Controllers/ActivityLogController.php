<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('activity-log', [
            'activities' => Activity::all(),
        ]);
    }
}
