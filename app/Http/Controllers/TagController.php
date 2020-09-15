<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Tag;

class TagController extends Controller
{ 
  function __construct()
  {
       $this->middleware('permission:tag-list');
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
        $validatedData = $request->validate([
          'title' => 'required'
        ]);

        $tag = Tag::create([
          'title' => $validatedData['title']
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

}
