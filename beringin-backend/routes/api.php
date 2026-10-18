<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LaporanController;
use Illuminate\Support\Facades\Route;

// Endpoint Publik
Route::post('/login', [AuthController::class, 'login']);
Route::get('/laporan', [LaporanController::class, 'index']);
Route::post('/laporan', [LaporanController::class, 'store']);

// Endpoint Terproteksi Token Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Khusus Petugas (Authorization Check di LaporanController)
    Route::patch('/laporan/{id}/status', [LaporanController::class, 'updateStatus']);
});
