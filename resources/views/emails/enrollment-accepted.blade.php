<x-mail::message>
# Congratulations, {{ $firstName }} {{ $lastName }}!

Your enrollment application with Highland Technical Training Academy INC has been **accepted**!

You can now log in to our portal using the following credentials:

**Username:** {{ $username }}
**Password:** {{ $password }}

Please log in and consider changing your password immediately for security reasons.

<x-mail::button :url="url('/login')">
Log In to Your Account
</x-mail::button>

We look forward to having you as part of our community!

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>