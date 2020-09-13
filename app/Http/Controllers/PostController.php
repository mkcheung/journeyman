<?php

namespace App\Http\Controllers;

use App\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    function __construct()
    {
         $this->middleware('permission:post-list');
         $this->middleware('permission:post-create', ['only' => ['create','store']]);
         $this->middleware('permission:post-edit', ['only' => ['edit','update']]);
         $this->middleware('permission:post-delete', ['only' => ['destroy']]);
    }
    
    public function index()
    {
        $posts = Post::get();
        return $posts->toJson();
    }

    public function getUserPosts(Request $request)
    {
        $userId = $request->query('userId');
        $posts = Post::where('user_id', '=', $userId)->get();
        return $posts->toJson();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('posts.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // $validatedData = $request->validate([
        //   'name' => 'required',
        //   'description' => 'required',
        // ]);

        $selectedTagIds = [];
        $selectedTags = $request['selectedTags'];
        foreach($selectedTags as $selectedTag){
            $selectedTagIds[] = $selectedTag['id'];
        }
        $post = Post::create([
          'title' => $request['title'],
          'slug' => str_slug($request->title, '-'),
          'content' => $request['content'],
          'published' => $request['publish'],
          'category' => $request['category'],
          'user_id' => 1//$request['user_id']
        ]);

        $post->tags()->sync($selectedTagIds);

        return response()->json('Post created!');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $post = Post::where('id', $id)->first();
        return $post->toJson();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     
    public function edit($id)
    {
        $post = Post::findOrFail($id);
        return view('posts.edit', compact('post'));
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

        $data = $request->all();
        $post = Post::findOrFail((int)$id);

        $post->title = $data['data']['title'];
        $post->content = $data['data']['content'];
        $post->slug = str_slug($data['data']['title'], '-');
        $post->published = $data['data']['publish'];
        $post->user_id = $data['data']['user_id'];
        $post->save();
        return redirect('posts');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $post = $post->delete();
        return redirect('posts');
    }
}



