<?php

namespace App\Http\Controllers;

use App\Book;
use App\Citation;
use Illuminate\Http\Request;

class BookController extends Controller
{
    function __construct()
    {
         $this->middleware('permission:book-list', ['only' => ['index','show','showUserBooks']]);
         $this->middleware('permission:book-create', ['only' => ['create','store']]);
         $this->middleware('permission:book-edit', ['only' => ['edit','update']]);
         $this->middleware('permission:book-delete', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $books = Book::get();
        return $books->toJson();
    }

    public function showUserBooks(Request $request)
    {
        $userId = $request->query('userId');
        $books = Book::where('user_id', '=', $userId)->with('citations')->get();
        return $books->toJson();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $bookData = $request->get('data');

        $pagesInBook = $bookData['pages'] ? $bookData['pages'] : '';
        $author_first_name = $bookData['author_first_name'] ? $bookData['author_first_name'] : '';
        $author_middle = $bookData['author_middle'] ? $bookData['author_middle'] : '';
        $author_last_name = $bookData['author_last_name'] ? $bookData['author_last_name'] : '';
        $userId = $bookData['userId'];
        $bookTitle = $bookData['jsonFile']['title'];
        $bookCitations = $bookData['jsonFile']['highlights'];
        $citationsToCreate = [];
        $now = \Carbon\Carbon::now();

        $book = Book::create([
            'title' => $bookTitle,
            'user_id' => $userId,
            'author_first_name' => $author_first_name,
            'author_middle' => $author_middle,
            'author_last_name' => $author_last_name,
            'pages' => (int)$pagesInBook
        ]);

        foreach($bookCitations as $bookCitation){
            $citationsToCreate[] = [
                'book_id' => $book->id,
                'content' => $bookCitation['text'],
                'page' => $bookCitation['location']['value'],
                'created_at' => $now,
                'updated_at' => $now
            ];
        }
        $results = Citation::insert($citationsToCreate);

        return response()->json([]);
    }

    public function show($id)
    {

    }

    public function searchByTitle(Request $request)
    {
        $bookTitle = $request->query('bookTitle');

        $bookCitations =  !empty($bookTitle) ? Book::where('title', 'like', '%' . $bookTitle . '%')->with('citations')->get()->toArray() : [];

        return $bookCitations;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Book  $book
     * @return \Illuminate\Http\Response
     */
    public function edit(Book $book)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Book  $book
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Book $book)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Book  $book
     * @return \Illuminate\Http\Response
     */
    public function destroy(Book $book)
    {
        $book->chapters->each(function($chapter){
            $chapter->delete();
        });
        $book->citations->each(function($citation){
            $citation->delete();
        });
        $book->delete();
        return;
    }
}
