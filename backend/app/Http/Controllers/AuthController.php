<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\TransientToken;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:6',
            ]);

            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => bcrypt($request->input('password')),
            ]);

            if (Auth::attempt($request->only('email', 'password'))) {
                $user = $request->user();
                $token = $user->createToken('auth_token');

                return response()->json([
                    'token' => $token->plainTextToken,
                    'user' => $user,
                ]);
            }
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Handle other exceptions (e.g., database errors) here
            return response()->json(['error' => 'Something went wrong.', $e], 500);
        }
    }


    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if (Auth::attempt($request->only('email', 'password'))) {
                $user = $request->user();
                $token = $user->createToken('auth_token');

                return response()->json([
                    'token' => $token->plainTextToken,
                    'user' => $user,
                ]);
            }

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Successfully logged out']);
    }
}
