<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learners', function (Blueprint $table) {
            $table->id('learner_id');
            $table->date('entry_date');
            $table->string('last_name', 50);
            $table->string('first_name', 50);
            $table->string('middle_name', 50)->nullable();
            $table->string('extension_name', 10)->nullable();
            $table->string('gender', 10);
            $table->string('civil_status', 20);
            $table->date('birth_date')->nullable();
            $table->integer('age')->nullable();
            $table->string('birthplace_city_municipality', 100)->nullable();
            $table->string('birthplace_province', 100)->nullable();
            $table->string('birthplace_region', 100)->nullable();
            $table->string('nationality', 50)->nullable();
            $table->string('employment_status', 50)->nullable();
            $table->string('employment_type', 50)->nullable();
            $table->string('parent_guardian_name', 100)->nullable();
            $table->text('parent_guardian_mailing_address')->nullable();
            $table->boolean('t2mis_auto_generated')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learners');
    }
};