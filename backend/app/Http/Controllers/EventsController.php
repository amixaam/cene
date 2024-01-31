<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Review;
use App\Models\Ticket;
use App\Models\TicketType;
use App\Models\VipSeat;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EventsController extends Controller
{
    public function index()
    {
        return response()->json(Event::all());
    }

    public function show($eventId)
    {
        $event = Event::with("genre", "AgeRating")->findOrFail($eventId);

        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }

        $ratings = Review::where('event_id', $eventId)->pluck('rating');
        $ratingAVG = $ratings->isEmpty() ? null : $ratings->avg();

        $seatsData = [];
        $maxRows = $event->max_rows;
        $maxCols = $event->max_cols;

        $specialSeats = VipSeat::where('event_id', $eventId)->get();
        $ticketTypes = TicketType::where('event_id', $eventId)->get();
        $ticketCount = Ticket::where('event_id', $eventId)->count();
        $freeSeats = $maxRows * $maxCols - $ticketCount;
        $tickets = Ticket::where('event_id', $eventId)->get();
        $takenSeats = [];

        foreach ($tickets as $ticket) {
            $takenSeats[] = [
                'row' => $ticket->row_num,
                'col' => $ticket->col_num,
            ];
        }

        $cheapestTicketType = $ticketTypes->sortBy('price')->first();

        $defaultName = $cheapestTicketType->name ?? null;
        $defaultPrice = $cheapestTicketType->price ?? null;

        for ($row = 1; $row <= $maxRows; $row++) {
            for ($col = 1; $col <= $maxCols; $col++) {
                $seatsData[] = [
                    'row' => $row,
                    'col' => $col,
                    'name' => $defaultName,
                    'price' => $defaultPrice,
                    'taken' => in_array(['row' => $row, 'col' => $col], $takenSeats),
                ];
            }
        }

        $ticketTypeMap = $ticketTypes->keyBy('id');

        foreach ($specialSeats as $specialSeat) {
            $ticketTypeId = $specialSeat->ticket_types_id;

            if (isset($ticketTypeMap[$ticketTypeId])) {
                $ticketType = $ticketTypeMap[$ticketTypeId];

                $index = ($specialSeat->row_num - 1) * $maxCols + ($specialSeat->col_num - 1);

                $seatsData[$index]['name'] = $ticketType->name;
                $seatsData[$index]['price'] = $ticketType->price;
            }
        }

        return response()->json(['event' => $event, 'ratingAVG' => $ratingAVG, 'seats' => $seatsData, 'freeSeats' => $freeSeats]);
    }

    public function getRandomReview()
    {
        $review = Review::with('event')->inRandomOrder()->first();
        return response()->json($review);
    }

    public function store(Request $request)
    {
        // return response()->json($request->all());
        try {
            $request->validate([
                'file' => 'required|image|mimes:jpeg,png,jpg,gif|max:10000',
                'name' => 'required|string',
                'description' => 'required|string',
                'genre_id' => 'required|exists:genres,id',
                'date' => 'required|date',
                'time' => 'required|date_format:H:i',
                'length' => 'required|integer',
                'regular_ticket_price' => 'required|regex:/^\d+(\.\d{1,2})?$/',
                'vip_ticket_price' => 'required|regex:/^\d+(\.\d{1,2})?$/',
            ]);

            $file_path = $request->file('file')->store('images', 'public');
            $request->mergeIfMissing(['file_path' => asset("storage/$file_path")]);

            $event = Event::create($request->all());

            return response()->json($event);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong.', $e], 500);
        }
    }
}
