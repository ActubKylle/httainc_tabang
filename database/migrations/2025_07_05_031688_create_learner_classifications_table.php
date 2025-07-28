<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learner_classifications', function (Blueprint $table) {
            $table->foreignId('learner_id')->constrained('learners', 'learner_id')->onDelete('cascade');
            $table->foreignId('classification_id')->constrained('classifications')->onDelete('cascade');
            $table->string('other_classification_details', 255)->nullable();
            $table->primary(['learner_id', 'classification_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learner_classifications');
    }
};