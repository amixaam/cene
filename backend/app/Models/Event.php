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
        'length',
        'regular_ticket_price',
        'vip_ticket_price',
    ];

    public function genre()
    {
        return $this->belongsTo(Genre::class);
    }
}
