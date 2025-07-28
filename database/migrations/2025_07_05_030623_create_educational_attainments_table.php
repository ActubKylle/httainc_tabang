<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('educational_attainments', function (Blueprint $table) {
            $table->id('education_id');
            $table->foreignId('learner_id')->constrained('learners', 'learner_id')->onDelete('cascade');
            $table->boolean('no_grade_completed')->default(false);
            $table->boolean('elementary_undergraduate')->default(false);
            $table->boolean('elementary_graduate')->default(false);
            $table->boolean('junior_high_k12')->default(false);
            $table->boolean('senior_high_k12')->default(false);
            $table->boolean('high_school_undergraduate')->default(false);
            $table->boolean('high_school_graduate')->default(false);
            $table->boolean('post_secondary_non_tertiary_technical_vocational_undergraduate')->default(false);
            $table->boolean('post_secondary_non_tertiary_technical_vocational_course_graduate')->default(false);
            $table->boolean('college_undergraduate')->default(false);
            $table->boolean('college_graduate')->default(false);
            $table->boolean('masteral')->default(false);
            $table->boolean('doctorate')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('educational_attainments');
    }
};