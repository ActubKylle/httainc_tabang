<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EnrollmentAccepted extends Mailable
{
    use Queueable, SerializesModels;

    public $firstName;
    public $lastName;
    public $username;
    public $password;

    /**
     * Create a new message instance.
     */
    public function __construct(string $firstName, string $lastName, string $username, string $password)
    {
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->username = $username;
        $this->password = $password;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Enrollment with Highland Technical Training Academy inc Has Been Accepted!',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.enrollment-accepted', // This will point to resources/views/emails/enrollment-accepted.blade.php
            with: [
                'firstName' => $this->firstName,
                'lastName' => $this->lastName,
                'username' => $this->username,
                'password' => $this->password,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}