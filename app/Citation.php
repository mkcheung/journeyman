<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Chapter;

class Citation extends Model
{

    protected $fillable = [
    	'book_id',
    	'content',
    	'page'
    ]; 
 
    public function book()
    {
        return $this->belongsTo(Book::class, 'book_id');
    }

    public static function placeCitationWithinChapter($bookId){
    	$citations = self::select('id', 'book_id', 'page')->where('book_id', '=', $bookId)->get()->toArray();
    	$chapters = Chapter::select('id', 'page_begin', 'page_end', 'chapter_number')->where('book_id', '=', $bookId)->get()->toArray();


		foreach($citations as $citation){

			if(is_null($citation['book_id'])){
				continue;
			}

			foreach($chapters as $chapter){

				if(
					($citation['page'] >= $chapter['page_begin']) && 
					($citation['page'] <= $chapter['page_end'])
				){
					Citation::find($citation['id'])->update(['chapter_id' => $chapter['id']]);
				}
			}
		}

        return;
    }
}
