<?php

namespace App\Http\Controllers;

use App\Reply;
use Illuminate\Http\Request;

class ReplyController extends Controller
{
    function __construct()
    {
        $this->middleware('auth', ['except' => ['index', 'show']]);
        $this->middleware('permission:reply-create', ['only' => ['create','store']]);
        $this->middleware('permission:reply-edit', ['only' => ['edit','update']]);
        $this->middleware('permission:reply-delete', ['only' => ['destroy']]);
    }
    
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

    	$commentId = $request['comment_id'];

        $reply = Reply::create([
          'user_id' => $request['user_id'],
          'comment_id' => $commentId,
          'reply' => $request['reply'],
          'approved' => 0
        ]);

        $replies = Reply::where('comment_id', '=', $commentId)->with('user')->get()->all();

        return response()->json($replies);
    }
}
