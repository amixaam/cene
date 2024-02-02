<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'genre_id',
        'age_rating_id',
        'date',
        'file_path',
        'time',
        'length',
        'max_rows',
        'max_cols'
    ];

    public function genre()
    {
        return $this->belongsTo(Genre::class);
    }

    public function ageRating()
    {
        return $this->belongsTo(AgeRating::class);
    }

    public function ticketTypes()
    {
        return $this->hasMany(TicketType::class);
    }
}
