<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Review;
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
        $event = Event::find($eventId);

        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }

        return response()->json($event);
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
