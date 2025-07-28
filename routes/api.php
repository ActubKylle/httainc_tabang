<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AttendanceController; // Import your controller

// ... other routes ...

Route::post('/attendance', [AttendanceController::class, 'store']);