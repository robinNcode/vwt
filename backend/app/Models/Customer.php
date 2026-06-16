<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Spatie\Permission\Traits\HasRoles;


class Customer extends Authenticatable implements JWTSubject
{
    use SoftDeletes, HasApiTokens, Notifiable, HasRoles;
    
    protected $fillable = [
        'full_name',
        'phone_number',
        'email',
        'password',
        'is_active',
        'is_approved',
        'phone_verified_at',
        'email_verified_at',
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
        'is_approved' => 'boolean',
        'phone_verified_at' => 'datetime',
        'email_verified_at' => 'datetime',
    ];
    
    protected $hidden = [
        'password',
    ];
    
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }
    
    public function getJWTCustomClaims()
    {
        return [
            'id' => $this->id,
            'type' => 'customer',
        ];
    }
    
    public function getOrders()
    {
        return $this->hasMany(Order::class);
    }
    
    public function getCart()
    {
        return $this->hasOne(Cart::class);
    }
}