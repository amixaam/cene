<?php

namespace App\Http\Controllers;

use App\Models\AgeRating;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AgeRatingController extends Controller
{
    public function index()
    {
    }
    public function show($id)
    {
    }
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|min:1',
            ]);

            AgeRating::create($request->all());

            return response()->json(['message' => "Age rating created successfully!"]);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }
    public function destroy($id)
    {
        try {
            $ageRating = AgeRating::findOrFail($id);
            $events = Event::where('age_rating_id', $id)->get();
            if ($events->isNotEmpty()) {
                foreach ($events as $event) {
                    $event->update(['age_rating_id' => null]);
                }
            }
            $ageRating->delete();
            return response()->json(['message' => 'Age rating deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['errors' => $e], 500);
        }
    }
    public function update(Request $request, $id)
    {
    }
}
