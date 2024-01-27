<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\UsersController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// LOGGED IN ACTIONS
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/test', [UsersController::class, 'test']);

    Route::prefix('/users')->group(function () {
        Route::post('/', [UsersController::class, 'store']);
        Route::put('/{id}', [UsersController::class, 'update']);
        Route::delete('/{id}', [UsersController::class, 'destroy']);
    });

    Route::prefix('/events')->group(function () {
        Route::post('/', [EventsController::class, 'store']);
        Route::put('/{id}', [EventsController::class, 'update']);
        Route::delete('/{id}', [EventsController::class, 'destroy']);
    });
});

// GUEST ACTIONS
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'signup']);

Route::prefix('/users')->group(function () {
    Route::get('/', [UsersController::class, 'index']);
    Route::get('/{id}', [UsersController::class, 'show']);
});

Route::prefix('/events')->group(function () {
    Route::get('/', [EventsController::class, 'index']);
    Route::get('/{id}', [EventsController::class, 'show']);
});
