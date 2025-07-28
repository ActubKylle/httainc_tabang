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
        Schema::create('privacy_consents', function (Blueprint $table) {
            $table->id('consent_id');
            $table->foreignId('learner_id')->unique()->constrained('learners', 'learner_id')->onDelete('cascade'); // Unique constraint for one consent per learner
            $table->boolean('consent_given')->default(false);
            $table->date('date_agreed');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('privacy_consents');
    }
};
