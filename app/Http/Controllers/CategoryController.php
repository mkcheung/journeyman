<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Category;

class CategoryController extends Controller
{
  function __construct()
  {
       $this->middleware('permission:category-list', ['only' => ['index','show','showUserCategories']]);
       $this->middleware('permission:category-create', ['only' => ['create','store']]);
       $this->middleware('permission:category-edit', ['only' => ['edit','update']]);
       $this->middleware('permission:category-delete', ['only' => ['destroy']]);
  }

    public function index()
    {
        $categories = Category::get();

        return $categories->toJson();
    }

    public function showUserCategories(Request $request)
    {
        $userId = $request->query('userId');
        $categories = Category::where('user_id', '=', $userId)->with('posts')->get();
        return $categories->toJson();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
          'userId' => 'required',
          'title' => 'required',
          'description' => 'required',
          'slug' => 'required'
        ]);

        $category = Category::create([
          'user_id' => $validatedData['userId'],
          'title' => $validatedData['title'],
          'description' => $validatedData['description'],
          'slug' => $validatedData['slug']
        ]);

        return response()->json('Category created!');
    }

    public function show($id)
    {
        $category = Category::find($id);

        return $category->toJson();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
          'title' => 'required',
          'description' => 'required',
          'slug' => 'required'
        ]);

        $category = Category::findOrFail((int)$id);

        $category['title'] = $validatedData['title'];
        $category['description'] = $validatedData['description'];
        $category['slug'] = $validatedData['slug'];
        $category->save();
        return redirect('posts');
    }
}
