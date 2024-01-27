<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UsersController extends Controller
{

    public function test()
    {
        return response()->json(Genre::all());
    }
    // Get all users
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    // Get a specific user by ID
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:6',
            ]);

            $user = User::create($request->all());
            return response()->json($user, 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Handle other exceptions here
            return response()->json(['error' => 'Something went wrong.'], 500);
        }
    }

    // Update a user
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $request->validate([
                'name' => 'nullable',
                'email' => 'nullable|email|unique:users,email,' . $user->id,
                'password' => 'nullable|min:6',
            ]);

            // Log the input data
            Log::info('Update request data:', $request->all());

            // Update the user with the new data
            $user->update($request->all());

            // Log the updated user
            Log::info('Updated user data:', $user->toArray());

            // Return the updated user
            return response()->json($user, 200);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong.'], 500);
        }
    }

    // Delete a user
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(null, 204);
    }
}
