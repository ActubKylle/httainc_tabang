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
        Schema::create('scholarships', function (Blueprint $table) {
            $table->id('scholarship_id'); // Use scholarship_id as primary key
            $table->string('scholarship_name');
            $table->string('provider');
            $table->text('description')->nullable();
            $table->text('eligibility_criteria');
            $table->integer('available_slots');
            $table->date('application_deadline');
            $table->enum('status', ['Open', 'Closed', 'Ongoing'])->default('Open');
            $table->timestamps();
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
