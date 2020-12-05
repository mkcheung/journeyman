<?php

namespace App\Http\Controllers;

use App\Comment;
use App\User;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    function __construct()
    {
        $this->middleware('auth', ['except' => ['index', 'show']]);
        $this->middleware('permission:comment-create', ['only' => ['create','store']]);
        $this->middleware('permission:comment-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:comment-delete', ['only' => ['destroy']]);
    }
    
    public function index()
    {
        $commentsByUser = User::with('comments')->get();
        return $commentsByUser->toJson();
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

    	$postId = $request['post_id'];

        $comment = Comment::create([
          'user_id' => $request['user_id'],
          'post_id' => $postId,
          'comment' => $request['commentText'],
          'approved' => 0
        ]);

        $comments = Comment::where('post_id', '=', $postId)->with('user')->get()->all();

        return response()->json($comments);
    }
}
