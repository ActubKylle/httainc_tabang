<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Learner;

class NewLearnerRegistration implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    // Make the learner public so it's automatically included in the broadcast
    public Learner $learner;

    /**
     * Create a new event instance.
     */
    public function __construct(Learner $learner)
    {
        $this->learner = $learner;
    }

    /**
     * Get the channels the event should broadcast on.
     * We use a private channel for security.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('staff-enrollments'),
        ];
    }

    /**
     * The event's broadcast name.
     * This is what you listen for on the frontend.
     */
    public function broadcastAs(): string
    {
        return 'learner.registered';
    }

    /**
     * Get the data to broadcast.
     * Customize the payload to send only what the frontend needs.
     */
    public function broadcastWith(): array
    {
        return [
            'learner_id' => $this->learner->id,
            'first_name' => $this->learner->first_name,
            'last_name' => $this->learner->last_name,
            'message' => "A new learner, {$this->learner->first_name} {$this->learner->last_name}, has registered."
        ];
    }
}