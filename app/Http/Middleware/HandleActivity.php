<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Activity;
use Illuminate\Support\Facades\Auth;
use App\Models\Role;
use Jenssegers\Agent\Facades\Agent;

class HandleActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $roleName = Auth::check() ? Role::find(Auth::user()->roles->first()->id)->name : null;
        $response = $next($request);

        if (!$roleName || $roleName === "super user") return $response;
        // if (!$roleName || $roleName === "super user" || $request->header("Purpose") === "prefetch") return $response;

        $browser = Agent::browser();
        $os = Agent::platform();
        $device = Agent::deviceType();

        Activity::create([
            "visitor_name" => $roleName,
            "method" => $request->method(),
            "route" => $request->getPathInfo(),
            "ip" => $request->ip(),
            "browser" => $browser,
            "os" => $os,
            "device" => $device,
        ]);

        return $response;
    }
}
