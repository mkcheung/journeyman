<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
 
class Tag extends Model
{
    protected $fillable = ['title', 'tag_id'];

    public function posts()
    {
        return $this->belongsToMany(Post::class, 'post_tag', 'post_id', 'tag_id');
    }
}
