<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Tag;

class TagController extends Controller
{ 

    function __construct()
    {
        $this->middleware('auth', ['except' => ['showTags']]);
        $this->middleware('permission:tag-list', ['only' => ['index', 'show', 'getTagsToPosts']]);
        $this->middleware('permission:tag-create', ['only' => ['create','store']]);
        $this->middleware('permission:tag-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:tag-delete', ['only' => ['destroy']]);
    }
  
    public function index()
    {
        $tags = Tag::get();

        return $tags->toJson();
    }

    public function store(Request $request)
    {
        $tagData = $request->get('data');

        $tag = Tag::create([
          'title' => $tagData['title']
        ]);

        return response()->json('Tag created!');
    }

    public function show($id)
    {
        $tag = Tag::with(['tasks' => function ($query) {
            $query->where('is_completed', false);
        }])->find($id);

        return $tag->toJson();
    }

    public function showTags(Request $request)
    {
        $tags = Tag::get();

        return $tags->toJson();
    }
 
    public function getTagsToPosts()
    {
        $tagsToPosts = Tag::with('posts')->get();
        return $tagsToPosts->toJson();
    }
}
