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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string("file_path");
            $table->foreignId('genre_id')->nullable()->constrained();
            $table->foreignId('age_rating_id')->nullable()->constrained();
            $table->string('name');
            $table->text('description');
            $table->date('date');
            $table->time('time');
            $table->integer('length');
            $table->integer('max_rows')->default(5);
            $table->integer('max_cols')->default(12);

            $table->boolean('published')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
