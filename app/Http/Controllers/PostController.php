<?php

namespace App\Http\Controllers;

use App\Post;
use App\User;
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
        $this->middleware('auth', ['except' => ['index', 'getUserPosts', 'getRecentPosts', 'getPostAndDecendants', 'show']]);
        $this->middleware('permission:post-create', ['only' => ['create','store']]);
        $this->middleware('permission:post-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:post-delete', ['only' => ['destroy']]);
    }
    
    public function index()
    {
        $postsByUser = User::with('posts')->get();
        return $postsByUser->toJson();
    }

    public function getUserPosts(Request $request)
    {
        $userId = $request->query('userId');
        $posts = Post::where('user_id', '=', $userId)->where('parent', '=', 1)->with('user')->orderBy('created_at')->get();
        return $posts->toJson();
    }

    public function getRecentPosts(Request $request)
    {
        $posts = Post::where('published', '=', 1)->where('parent', '=', 1)->with('user')->limit(10)->get();
        return $posts->toJson();
    }

    public function getPostAndDecendants(Request $request)
    {
        $postId = $request->query('postId');
        $posts = Post::where('id', '=', (int)$postId)->where('parent', '=', 1)->with('user')->with('allDescendantPosts')->get()->all();

        if(empty($posts)){
            return json_encode($posts);
        }

        $descendantPosts = [];
        $descendantPosts[] = [
            'title' => $posts[0]['title'],
            'content' => $posts[0]['content'],
            'id' => $posts[0]['id'],
            'slug' => $posts[0]['slug'],
            'user' => $posts[0]['user'],
            'published' => $posts[0]['published'],
            'descendant_post_id' => $posts[0]['descendant_post_id'],
            'created_at' => $posts[0]['created_at'],
            'updated_at' => $posts[0]['updated_at'],
            'user_id' => $posts[0]['user_id'],
        ];

        $allDescendantPosts = $posts[0]['allDescendantPosts'];

        $this->processDescendants($posts[0]['allDescendantPosts'], $descendantPosts);


        usort($descendantPosts,[$this,"compareValues"]);

        return json_encode($descendantPosts);
    }

    private static function compareValues($a, $b){
        if ($a["id"] == $b["id"]) {
            return 0;
        }
        return ($a["id"] < $b["id"]) ? -1 : 1;
    }


    private function processDescendants($post, &$descendantPosts){

        if(is_null($post->first())){
            return;
        } else if(!empty($post[0]) && !empty($post[0]['allDescendantPosts'])) {
            $this->processDescendants($post[0]['allDescendantPosts'], $descendantPosts);
        }    

        $descendantPosts[] = [
            'title' => $post[0]['title'],
            'content' => $post[0]['content'],
            'id' => $post[0]['id'],
            'slug' => $post[0]['slug'],
            'user' => $post[0]['user'],
            'published' => $post[0]['published'],
            'descendant_post_id' => $post[0]['descendant_post_id'],
            'created_at' => $post[0]['created_at'],
            'updated_at' => $post[0]['updated_at'],
            'user_id' => $post[0]['user_id'],
        ];

        return;
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
          'published' => $request['published'],
          'category' => $request['category'],
          'user_id' => $request['user_id']
        ]);

        $post->tags()->sync($selectedTagIds);

        return response()->json($post);
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
        $post->published = $data['data']['published'];
        $post->user_id = $data['data']['user_id'];
        $post->save();
        return redirect('posts');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function destroy(Post $post)
    {
        $post = $post->delete();
        return;
    }
}



