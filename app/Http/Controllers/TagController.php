<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TagController extends Controller
{ 
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
