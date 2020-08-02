<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{

    protected $fillable = ['title','author','pages']; 
 
    public function posts()
    {
        return $this->belongsToMany(Post::class, 'book_post', 'book_id', 'post_id');
    }
 
    public function citations()
    {
        return $this->hasMany(Citation::class, 'book_id');
    }
}
