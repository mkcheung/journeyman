<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Reply extends Model
{
    protected $appends = ['date_formatted'];
 
    public function comment()
    {
        return $this->belongsTo(Comment::class, 'comment_id');
    }
 
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
 
    public function getDateFormattedAttribute()
    {
        return \Carbon\Carbon::parse($this->created_at)->format('Y/m/d h:i a');
    }
}
