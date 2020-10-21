<?php

namespace App\Http\Controllers;

use App\Citation;
use Illuminate\Http\Request;

class CitationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $citations = Citation::get();
        return $citations->toJson();
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

        $citation = Citation::create([
          'book_id' => $request['data']['book_id'],
          'content' => $request['data']['content'],
          'page' => $request['data']['page'],
          'chapter' => (!empty($request['data']) && $request['data']['chapter']) ? (int) $request['data']['chapter'] : null
        ]);

        return response()->json('Citation created!');
    }


    public function assignChapters(Request $request)
    {
        Citation::placeCitationWithinChapter($request['bookId']);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Citation  $citation
     * @return \Illuminate\Http\Response
     */
    public function show(Citation $citation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Citation  $citation
     * @return \Illuminate\Http\Response
     */
    public function edit(Citation $citation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Citation  $citation
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Citation $citation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Citation  $citation
     * @return \Illuminate\Http\Response
     */
    public function destroy(Citation $citation)
    {
        //
    }
}
