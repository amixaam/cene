<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\TicketController;
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
        Route::post('/type', [EventsController::class, 'createType']);
        Route::post('/seats', [EventsController::class, 'addVIPSeats']);
        Route::delete('/type/{type_id}', [EventsController::class, 'destroyType']);
        Route::post('/', [EventsController::class, 'store']);
        Route::delete('/{id}', [EventsController::class, 'destroyEvent']);
        Route::get('/publish/{event_id}', [EventsController::class, 'publishEvent']);
        Route::put('/{id}', [EventsController::class, 'update']);
    });

    Route::prefix('/payments')->group(function () {
        Route::post('/checkout', [StripeController::class, 'checkout']);
        Route::post('/success', [StripeController::class, 'success']);
        Route::post('/cancel', [StripeController::class, 'cancel']);
        Route::get('/history', [TicketController::class, 'getHistory']);
        Route::post('/generatePDF', [TicketController::class, 'createPDF']);

        // Route::put('/{id}', [StripeController::class, 'update']);
        // Route::delete('/{id}', [StripeController::class, 'destroy']);
    });
});

// GUEST ACTIONS
Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'signup']);


Route::prefix('/users')->group(function () {
    Route::get('/', [UsersController::class, 'index']);
    Route::get('/{id}', [UsersController::class, 'show']);
});

Route::prefix('/events')->group(function () {
    Route::get('/all', [EventsController::class, 'getAllEvents']);
    Route::get('/options', [EventsController::class, 'getOptions']);
    Route::get('/', [EventsController::class, 'index']);
    Route::get('/genres', [EventsController::class, 'getGenres']);
    Route::get('/types/{event_id}', [EventsController::class, 'getTypes']);
    Route::get('/{id}', [EventsController::class, 'show']);
    Route::get('/all/{id}', [EventsController::class, 'showADMIN']);
});

Route::prefix('/reviews')->group(function () {
    Route::get('/random', [EventsController::class, 'getRandomReview']);
});
