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
        Schema::create('scholarship_application_documents', function (Blueprint $table) {
            $table->id();

            // --- THE FIX ---
            // The foreign key constraint now explicitly references the 'student_scholarship_id'
            // column on the 'student_scholarships' table to match your custom primary key.
            $table->foreignId('student_scholarship_id')->constrained('student_scholarships', 'student_scholarship_id')->onDelete('cascade');

            // Paths to the stored documents
            $table->string('birth_certificate_path');
            $table->string('transcript_of_records_path');
            $table->string('formal_photo_path');
            $table->string('parent_id_path');
            $table->string('marriage_contract_path')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scholarship_application_documents');
    }
};
