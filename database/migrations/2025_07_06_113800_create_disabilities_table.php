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
        Schema::create('disabilities', function (Blueprint $table) {
             $table->id('disability_id');
            $table->foreignId('learner_id')->constrained('learners', 'learner_id')->onDelete('cascade');
            $table->foreignId('disability_type_id')->constrained('disability_types')->onDelete('cascade'); // Link to the types table
            $table->string('cause_of_disability', 50)->nullable(); // e.g., Congenital/Unborn, Illness, Injury
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disabilities');
    }
};
