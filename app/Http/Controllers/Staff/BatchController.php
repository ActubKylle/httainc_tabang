<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;

class BatchController extends Controller
{
    // Fetch all batches belonging to a specific program
    public function index(Program $program)
    {
        return response()->json($program->batches);
    }
}