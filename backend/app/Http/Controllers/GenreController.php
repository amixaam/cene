<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Genre;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class GenreController extends Controller
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

            Genre::create($request->all());

            return response()->json(['message' => "Age rating created successfully!"]);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['errors' => $e], 500);
        }
    }
    public function destroy($id)
    {
        try {
            $genre = Genre::findOrFail($id);
            $events = Event::where('genre_id', $id)->get();
            if ($events->isNotEmpty()) {
                foreach ($events as $event) {
                    $event->update(['genre_id' => null]);
                }
            }
            $genre->delete();
            return response()->json(['message' => 'Genre deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['errors' => $e], 500);
        }
    }
    public function update(Request $request, $id)
    {
    }
}
