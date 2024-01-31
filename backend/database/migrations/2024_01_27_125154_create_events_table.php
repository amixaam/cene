<?php

use App\Models\TicketType;
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
            $table->integer('max_rows')->default(5);
            $table->integer('max_cols')->default(12);

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
