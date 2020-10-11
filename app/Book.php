<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{

    protected $fillable = [
    	'title',
    	'author_first_name',
    	'author_middle',
    	'author_last_name',
    	'pages',
    	'user_id'
    ]; 

    protected $appends = [
        'author_full_name'
    ];
 
    public function citations()
    {
        return $this->hasMany(Citation::class, 'book_id');
    }
 
    public function posts()
    {
        return $this->belongsToMany(Post::class, 'book_post', 'book_id', 'post_id');
    }
 
    public function user()
    {
        return $this->belongsTo(User::class, 'book_id');
    }

    public function getAuthorFullNameAttribute()
    {
    	$author_full_name = '';
    	if($this->author_middle){
    		$author_full_name = $this->author_first_name.' '.$this->author_middle.' '.$this->last_name;
    	} else {
    		$author_full_name = $this->author_first_name.' '.' '.$this->last_name;
    	}

        return $author_full_name;    
    }
}
