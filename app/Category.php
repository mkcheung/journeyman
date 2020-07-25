<?php

namespace App;
 
use Illuminate\Database\Eloquent\Model;
 
class Category extends Model
{
    protected $fillable = [
    	'title',
    	'description',
    	'slug'
    ];

    public function posts()
    {
        return $this->hasMany(Post::class, 'category_id');
    }
}
