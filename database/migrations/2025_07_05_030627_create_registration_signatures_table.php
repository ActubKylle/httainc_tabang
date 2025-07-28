<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registration_signatures', function (Blueprint $table) {
            $table->id('signature_id');
            $table->foreignId('learner_id')->unique()->constrained('learners', 'learner_id')->onDelete('cascade');
            $table->string('applicant_signature_printed_name', 100)->nullable();
            $table->date('date_accomplished')->nullable();
            $table->string('registrar_signature_printed_name', 100)->nullable();
            $table->date('date_received')->nullable();
            $table->string('thumbmark_image_path', 255)->nullable();
            $table->string('picture_image_path', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registration_signatures');
    }
};