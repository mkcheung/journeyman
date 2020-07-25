<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Category;

class CategoryController extends Controller
{
	public function index()
      {
        $categories = Category::get();

        return $categories->toJson();
      }

      public function store(Request $request)
      {
        $validatedData = $request->validate([
          'title' => 'required',
          'description' => 'required',
          'slug' => 'required'
        ]);

        $category = Category::create([
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
}
