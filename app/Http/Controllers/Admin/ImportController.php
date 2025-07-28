<?php

namespace App\Http\Controllers\Admin;

use App\Jobs\ImportStudentsJob; // You will create this next
use Illuminate\Http\Request;

public function handleImport(Request $request)
{
    $request->validate([
        'file' => 'required|mimes:xlsx,xls,csv'
    ]);

    // Store the file and get its path
    $path = $request->file('file')->store('imports');

    // Dispatch the job to process the import in the background
    ImportStudentsJob::dispatch($path);

    return redirect()->back()->with('success', 'Your import has been queued! You will be notified upon completion.');
}
