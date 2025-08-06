<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('staff-enrollments', function ($user) {
    // This checks if the logged-in user's 'role' in the database is 'admin'.
    // It must be the exact lowercase string 'admin'.
    return $user && $user->role === 'staff';
});

// This checks if the ID of the logged-in user matches the ID in the channel name.
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
