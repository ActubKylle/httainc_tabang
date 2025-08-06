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
        Schema::create('student_scholarships', function (Blueprint $table) {
            $table->id('student_scholarship_id'); // Primary key for the pivot table
            
            // Foreign key for the learner (student)
            $table->foreignId('learner_id')->constrained('learners', 'learner_id')->onDelete('cascade');

            // Foreign key for the scholarship
            $table->foreignId('scholarship_id')->constrained('scholarships', 'scholarship_id')->onDelete('cascade');
            
            $table->date('application_date');
            $table->enum('status', ['Pending', 'Approved', 'Rejected', 'Withdrawn'])->default('Pending');
            $table->date('date_processed')->nullable(); // Date of approval or rejection
            $table->text('remarks')->nullable(); // Optional notes from staff

            $table->timestamps();

            // Ensure a student can only apply for the same scholarship once
            $table->unique(['learner_id', 'scholarship_id']);
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
