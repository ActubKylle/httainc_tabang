<?php

    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;

    class LearnerAddress extends Model
    {
        use HasFactory;

        protected $primaryKey = 'address_id';
        protected $fillable = [
            'learner_id',
            'number_street',
            'city_municipality',
            'barangay',
            'district',
            'province',
            'region',
            'email_address',
            'facebook_account',
            'contact_no',
        ];

        public function learner()
        {
            return $this->belongsTo(Learner::class, 'learner_id', 'learner_id');
        }
    }