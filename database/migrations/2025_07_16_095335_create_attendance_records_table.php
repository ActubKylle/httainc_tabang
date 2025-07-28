<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->string('user_id'); // e.g., HTTA-2025-0009
            $table->double('latitude', 10, 7); // Latitude with precision
            $table->double('longitude', 10, 7); // Longitude with precision
            $table->timestamp('timestamp'); // Date and time of attendance
            $table->boolean('authenticated')->default(false); // Biometric authentication status
            $table->string('location_status')->default('unknown'); // e.g., 'within_campus', 'outside_campus'
            $table->timestamps(); // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
    }
};
