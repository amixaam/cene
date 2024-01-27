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
            $table->string('name');
            $table->text('description');
            $table->foreignId('genre_id')->constrained();
            $table->date('date');
            $table->time('time');
            $table->string("file_path");
            $table->integer('length');
            $table->foreignId('age_rating_id')->nullable()->constrained();
            $table->decimal('regular_ticket_price');
            $table->decimal('vip_ticket_price');
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
