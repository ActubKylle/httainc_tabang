<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_enrollments', function (Blueprint $table) {
            $table->id('enrollment_id'); // Primary key for this table
            $table->foreignId('learner_id')->constrained('learners', 'learner_id')->onDelete('cascade');

            // Correct foreign key to the 'programs' table (auto-creates program_id column)
            $table->foreignId('program_id')->constrained('programs')->onDelete('cascade');

            // IMPORTANT: REMOVE THIS LINE if it's present in your existing migration:
            // $table->string('course_qualification', 255); // <-- This column should NOT exist

            $table->string('scholarship_package', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_enrollments');
    }
};