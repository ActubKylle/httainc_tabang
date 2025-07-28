<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use App\Http\Middleware\AdminMiddleware; // <--- ADD THIS IMPORT

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        api: __DIR__.'/../routes/api.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);


        $middleware->alias([ // <--- ADD THIS BLOCK
            'admin' => AdminMiddleware::class, // <--- YOUR ADMIN MIDDLEWARE
            // You might also find 'auth' and 'verified' aliases here from the starter kit
            // 'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
            // 'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        ]);
    })

    
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
