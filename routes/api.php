<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::resource('roles', 'RoleController');
Route::group([
    'prefix' => 'auth'
], function () {
    Route::post('login', 'AuthController@login');
    Route::post('signup', 'AuthController@signup');
    Route::get('signup/activate/{token}', 'AuthController@signupActivate');
    Route::resource('roles', 'RoleController');
  
    Route::group([
      'middleware' => 'auth:api'
    ], function() {
        Route::get('logout', 'AuthController@logout');
        Route::get('user', 'AuthController@user');
    });
});

Route::group([    
    'namespace' => 'Auth',    
    'middleware' => 'api',    
    'prefix' => 'password'
], function () {    
    Route::post('create', 'PasswordResetController@create');
    Route::get('find/{token}', 'PasswordResetController@find');
    Route::post('reset', 'PasswordResetController@reset');
});

Route::group(['middleware' => 'auth:api'], function() {
    Route::get('books/searchByTitle', 'BookController@searchByTitle');
    Route::resource('books', 'BookController');
    Route::resource('citations', 'CitationController');
    Route::resource('categories', 'CategoryController');
    Route::resource('comments', 'CommentController');
    Route::get('posts/getUserPosts', 'PostController@getUserPosts');
    Route::resource('posts', 'PostController');
    Route::resource('tags', 'TagController');
    Route::resource('users', 'UserController');
});