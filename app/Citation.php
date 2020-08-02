<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Citation extends Model
{

    protected $fillable = ['book_id','content','page']; 
 
    public function book()
    {
        return $this->belongsTo(Book::class, 'book_id');
    }
}
