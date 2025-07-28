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
        Schema::table('learners', function (Blueprint $table) {
            // Add the user_id column as a foreign key
            // Use nullable if a learner can exist without a user initially.
            // If every learner MUST have a user, remove ->nullable() after a successful first migration
            // and handle the data integrity (e.g., ensure user is created first).
            $table->foreignId('user_id')
                  ->nullable() // Keep nullable for now to avoid issues with existing data if any, or if your logic allows for it.
                  ->after('learner_id') // Place it after learner_id for logical order
                  ->constrained('users') // Assumes 'users' table and 'id' primary key
                  ->onDelete('cascade'); // Optional: Deletes learner if associated user is deleted
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('learners', function (Blueprint $table) {
            // Drop the foreign key constraint first
            $table->dropForeign(['user_id']);
            // Then drop the column
            $table->dropColumn('user_id');
        });
    }
};