<?php

use App\Http\Controllers\AuthController;
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

// login
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'signup']);

// api endpointus, ko var lietot, ja ir ielogojies
// GANDRĪZ VISIEM ENDPOINTIEM VAJADZĒTU BŪT ŠEIT
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // USERS
    Route::prefix('/users')->group(function () {
        Route::get('/', [AuthController::class, 'index']);
        Route::get('/{id}', [AuthController::class, 'show']);
        Route::post('/', [AuthController::class, 'store']);
        Route::put('/{id}', [AuthController::class, 'update']);
        Route::delete('/{id}', [AuthController::class, 'destroy']);
    });
});
