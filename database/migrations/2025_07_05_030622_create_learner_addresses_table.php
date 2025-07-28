<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learner_addresses', function (Blueprint $table) {
            $table->id('address_id');
            $table->foreignId('learner_id')->constrained('learners', 'learner_id')->onDelete('cascade');
            $table->string('number_street', 255)->nullable();
            $table->string('city_municipality', 100)->nullable();
            $table->string('barangay', 100)->nullable();
            $table->string('district', 100)->nullable();
            $table->string('province', 100)->nullable();
            $table->string('region', 100)->nullable();
            $table->string('email_address', 255)->nullable();
            $table->string('facebook_account', 255)->nullable();
            $table->string('contact_no', 20)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learner_addresses');
    }
};