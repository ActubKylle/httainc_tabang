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
        Schema::create('attendances', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('learner_id'); 
        $table->foreign('learner_id')->references('learner_id')->on('learners')->onDelete('cascade');
        $table->foreignId('program_id')->constrained('programs')->onDelete('cascade');
        $table->foreignId('marked_by_id')->constrained('users')->onDelete('cascade'); // Assumes 'users' table has 'id' PK
        $table->date('attendance_date');
        $table->timestamp('time_in')->nullable();
        $table->timestamp('time_out')->nullable();
        $table->enum('status', ['present', 'absent', 'excused', 'left_early']);
        $table->string('remarks')->nullable();
        $table->timestamps();

        $table->unique(['learner_id', 'attendance_date']);

     
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};