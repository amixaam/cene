<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VipSeat extends Model
{
    protected $fillable = [
        'event_id',
        'row_num',
        'col_num',
        'ticket_types_id'
    ];
    use HasFactory;

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
