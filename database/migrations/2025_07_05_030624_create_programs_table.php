<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id(); // This creates 'id' (unsignedBigInteger, auto-increment, primary)
            $table->string('course_name')->unique(); // THIS IS THE COLUMN THAT STORES THE PROGRAM'S NAME
            $table->string('qualification_level');
            $table->integer('duration_hours');
            $table->integer('duration_days');
            $table->text('description')->nullable();
            $table->date('enrollment_start_date')->nullable(); // Optional field for enrollment start date
            $table->date('enrollment_end_date')->nullable(); // Optional field for enrollment end
            $table->string('status')->default('active'); // 'active' or 'inactive'
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};