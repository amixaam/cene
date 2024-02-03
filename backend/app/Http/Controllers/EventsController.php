<?php

namespace App\Http\Controllers;

use App\Models\AgeRating;
use App\Models\Event;
use App\Models\Genre;
use App\Models\Order;
use App\Models\Review;
use App\Models\Ticket;
use App\Models\TicketType;
use App\Models\VipSeat;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EventsController extends Controller
{
    protected function deleteOldUnpaidOrders()
    {
        $cutoffTime = Carbon::now()->subMinutes(10);

        $orders = Order::where('status', 'unpaid')
            ->where('created_at', '<', $cutoffTime)
            ->get();

        foreach ($orders as $order) {
            $tickets = explode(', ', $order->ticket_ids);

            // Delete associated tickets
            foreach ($tickets as $ticketId) {
                $ticket = Ticket::find($ticketId);

                if ($ticket) {
                    $ticket->delete();
                }
            }

            // Delete the order itself
            $order->delete();
        }
    }

    public function getGenres()
    {
        $events = Event::with("genre")
            ->where("genre_id", "!=", null)
            ->get();
        $genres = [];
        foreach ($events as $key => $value) {
            $genres[$value->genre->id] = $value->genre->name;
        }

        return response()->json($genres);
    }

    public function GetReview($id)
    {
        $reviews = Review::with('user')
            ->where('event_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($reviews);
    }

    public function canUserPostReview(Request $request)
    {
        try {
            $request->validate([
                'event_id' => 'required|exists:events,id', // Assuming the table name is 'events'
            ]);

            $userId = auth()->user()->id;

            $order = Order::where('user_id', $userId)
                ->where('event_id', $request->event_id)
                ->where('status', 'paid')
                ->first();

            if ($order) {
                // User has a valid order for the event
                return response()->json(['message' => 'Can create review']);
            } else {
                // User doesn't have a valid order for the event
                return response()->json(['errors' => 'User does not have a valid order for this event'], 403);
            }
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['errors' => $e->getMessage()], 500);
        }
    }


    public function postReview(Request $request)
    {
        try {
            $request->validate([
                'event_id' => 'required|exists:events,id',
                'title' => 'required|string|min:1',
                'description' => 'required|string|min:1',
                'rating' => 'required|integer|min:1|max:5',
            ]);

            $userId = auth()->user()->id;

            $request->merge(['user_id' => $userId]); // Corrected merge syntax

            Review::create($request->all());

            return response()->json(['message' => 'Review created successfully!']);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    public function deleteReview($id)
    {
        try {
            $userId = auth()->user()->id;

            $review = Review::where('user_id', $userId)
                ->where('id', $id)
                ->first();

            if (!$review) {
                return response()->json(['errors' => 'Review not found or unauthorized'], 404);
            }

            $review->delete();

            return response()->json(['message' => 'Review deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['errors' => $e->getMessage()], 500);
        }
    }


    public function getTypes($event_id)
    {
        $typeArray = TicketType::where('event_id', $event_id)->get(); // Use get() to execute the query
        $types = [];

        foreach ($typeArray as $key => $value) {
            $types[] = [
                'id' => $value->id,
                'name' => $value->name,
                'price' => $value->price,
            ];
        }

        return response()->json($types); // Return $types instead of $typeArray
    }


    public function getOptions()
    {
        $genreData = Genre::all();
        $age_ratingData = AgeRating::all();

        $genres = [];
        foreach ($genreData as $key => $value) {
            $genres[$value->id] = $value->name;
        }

        $age_ratings = [];
        foreach ($age_ratingData as $key => $value) {
            $age_ratings[$value->id] = $value->name;
        }

        return response()->json(["genres" => $genres, "age_ratings" => $age_ratings]);
    }

    public function index()
    {
        return response()->json(Event::all()->where('published', true));
    }
    public function getAllEvents()
    {
        $events = Event::with('reviews')->get();
        return response()->json($events);
    }

    public function getAllReviews()
    {
        return response()->json(Review::with('user')->get());
    }
    public function showADMIN($eventId)
    {
        $this->deleteOldUnpaidOrders();

        $event = Event::with("genre", "AgeRating")
            ->findOrFail($eventId);

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

        return response()->json(['event' => $event, 'ratingAVG' => $ratingAVG, 'seats' => $seatsData, 'freeSeats' => $freeSeats, 'ticketTypes' => $ticketTypes]);
    }

    public function show($eventId)
    {
        $this->deleteOldUnpaidOrders();

        $event = Event::with("genre", "AgeRating")
            ->where('published', true)
            ->findOrFail($eventId);

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

        return response()->json(['event' => $event, 'ratingAVG' => $ratingAVG, 'seats' => $seatsData, 'freeSeats' => $freeSeats, 'ticketTypes' => $ticketTypes]);
    }

    public function getRandomReview()
    {
        $review = Review::with('event')
            ->where('rating', ">=", 4)
            ->inRandomOrder()
            ->first();
        return response()->json($review);
    }

    public function store(Request $request)
    {
        // return response()->json($request->all());
        try {
            $request->validate([
                'file' => 'required|image|mimes:jpeg,png,jpg,gif|max:10000',
                'name' => 'required|string|min:1',
                'description' => 'required|string|min:1',
                'genre_id' => 'required|exists:genres,id',
                'age_rating_id' => 'required|exists:age_ratings,id',
                'max_rows' => 'required|integer|min:3|max:8',
                'max_cols' => 'required|integer|min:3|max:18',
                'date' => 'required|date',
                'time' => 'required|date_format:H:i',
                'length' => 'required|integer|min:1',
            ]);

            if ($request->get("date")) {
                $date = Carbon::parse($request->get("date"));
                $now = Carbon::now();

                if ($date->lt($now)) {
                    return response()->json(['errors' => ['date' => 'Date must be in the future.']], 422);
                }
            }

            $file_path = $request->file('file')->store('images', 'public');
            $request->mergeIfMissing(['file_path' => asset("storage/$file_path")]);


            // $event = Event::create($request->all());
            $event = Event::create($request->all() + ['updated_at' => now(), 'created_at' => now()]);

            $ticketTypes = TicketType::create([
                'name' => 'Regular',
                'price' => 6.99,
                'event_id' => $event->id,
            ]);

            return response()->json(['message' => "Event created successfully!"]);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['errors' => $e], 500);
        }
    }

    public function publishEvent($event_id)
    {
        $event = Event::find($event_id);

        $event->published = !$event->published;

        $event->save();
    }


    public function destroyEvent($event_id)
    {
        // Check if there are any tickets associated with the event
        if (Ticket::where('event_id', $event_id)->exists()) {
            return response()->json(['error' => 'Cannot delete Event that has already been purchased.'], 422);
        }

        // Delete associated records
        TicketType::where('event_id', $event_id)->delete();
        VipSeat::where('event_id', $event_id)->delete();

        // Delete the event
        Event::destroy($event_id);
    }

    public function destroyType($type_id)
    {
        $tickets = Ticket::where('ticket_types_id', $type_id)->get();

        if (!$tickets->isEmpty()) {
            return response()->json(['error' => 'Cannot delete Ticket Type that has already been purchased.'], 422);
        }

        VipSeat::where('ticket_types_id', $type_id)->delete();
        $type = TicketType::find($type_id);
        if ($type) {
            $type->delete();
            return response()->json(['message' => 'Ticket type deleted successfully.']);
        } else {
            return response()->json(['error' => 'Ticket type not found.'], 404);
        }
    }

    public function createType(Request $request)
    {
        try {
            $request->validate([
                'event_id' => 'required|exists:events,id',
                'name' => 'required|string|min:1',
                'price' => 'required|numeric|min:0.01',
            ]);
            $ticketType = TicketType::create($request->all());

            return response()->json($ticketType);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => $e], 500);
        }
    }

    public function addVIPSeats(Request $request)
    {
        try {
            $seats = [];
            foreach ($request->get('seats') as $key => $value) {
                VipSeat::where('event_id', $request->get('event'))
                    ->where('row_num', $value['row'])
                    ->where('col_num', $value['col'])
                    ->delete();

                $seats[] = [
                    'event_id' => $request->get('event'),
                    'ticket_types_id' => $request->get('type'),
                    'row_num' => $value['row'],
                    'col_num' => $value['col'],
                ];
            }

            // return response()->json($seats);
            VipSeat::insert($seats);

            return response()->json('seats created!');
        } catch (\Exception $e) {
            return response()->json(['error' => $e], 500);
        }
    }
}
