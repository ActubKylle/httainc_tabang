<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('batches', function (Blueprint $table) {
            $table->date('date_started')->nullable()->after('schedule_details');
            $table->date('date_finished')->nullable()->after('date_started');
            $table->string('training_period')->nullable()->after('date_finished'); // e.g., "18 Days"
        });
    }

    public function down(): void
    {
        Schema::table('batches', function (Blueprint $table) {
            $table->dropColumn(['date_started', 'date_finished', 'training_period']);
        });
    }
};