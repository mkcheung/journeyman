<?php

namespace Tests\Feature;

use App\Post;
use App\User;
use App\Http\Controllers\PostController;
use Tests\TestCase;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use Mockery;

class PostControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testIndex()
    {
        $postIndex = collect(['test']);
        // Mock
        $controller = new PostController();
        $user = \Mockery::mock('overload:' . User::class);
        $user->shouldReceive('with')
            ->with('posts')
            ->andReturn($user)
            ->once();
        $user->shouldReceive('get')
            ->andReturn($user)
            ->once();

        $user->shouldReceive('toJson')
            ->andReturn($postIndex)
            ->once();


        // Fire
        $response = $controller->index();
        // Assert
        self::assertJson($response);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testGetUserPosts()
    {
        $userId = 1234;
        $postGetUserPostsReturn = collect(['test']);
        // Mock
        $controller = new PostController();
        $request = $this->createMock(Request::class);
        $post = \Mockery::mock('overload:' . Post::class);
        $post->shouldReceive('where')
            ->with('user_id', '=', $userId)
            ->andReturn($post)
            ->once();
        $post->shouldReceive('where')
            ->with('parent', '=', 1)
            ->andReturn($post)
            ->once();
        $post->shouldReceive('with')
            ->with('user')
            ->andReturn($post)
            ->once();
        $post->shouldReceive('orderBy')
            ->with('created_at')
            ->andReturn($post)
            ->once();
        $post->shouldReceive('get')
            ->andReturn($postGetUserPostsReturn)
            ->once();

        $post->shouldReceive('toJson')
            ->andReturn($postGetUserPostsReturn)
            ->once();
        // Expect
        $request->expects($this->once())
            ->method('query')
            ->with('userId')
            ->willReturn($userId);
        // Fire
        $response = $controller->getUserPosts($request);

        // Assert
        self::assertJson($response);
    }

    public function testGetRecentPostsWithTags(){

        // $returnedTagData = [
        //     'tags' => [
        //         '{"id":"1","value":"Test"}',
        //         '{"id":"2","value":"epistemology"}'
        //     ]
        // ];

        // $tagsRequested = [1,2];
        // $postGetRecentPostsReturn = collect(['test']);

        // // var_dump(json_decode($returnedTagData['tags'][0]));
        // // die;
        // // Mock
        // $controller = new PostController();
        // $request = $this->createMock(Request::class);
        // $post = \Mockery::mock('overload:' . Post::class);


        // $post->shouldReceive('when')
        //     ->once()
        //     ->with($tagsRequested, \Mockery::on( function($query) use ($tagsRequested){
        //         // $mockQuery = \Mockery::mock('Illuminate\Database\Eloquent\Builder');


        //         $query->shouldReceive('whereHas')
        //             ->once()
        //             ->with('tags', \Mockery::on(function($query2) use ($tagsRequested){
        //                 // $mockQuery2 = \Mockery::mock('Illuminate\Database\Eloquent\Builder');
        //                 $query2->shouldReceive('whereIn')
        //                     ->once()
        //                     ->with('id', $tagsRequested)
        //                     ->andReturn(true);
        //                 return true;
        //         }))
        //             ->andReturn(true);
        //         return true;
        //     }))
        //     ->andReturn($post);


        // $post->shouldReceive('where')
        //     ->with('published', '=', 1)
        //     ->andReturn($post)
        //     ->once();
        // $post->shouldReceive('where')
        //     ->with('parent', '=', 1)
        //     ->andReturn($post)
        //     ->once();
        // $post->shouldReceive('with')
        //     ->with('user')
        //     ->andReturn($post)
        //     ->once();
        // $post->shouldReceive('limit')
        //     ->with(10)
        //     ->andReturn($post)
        //     ->once();
        // $post->shouldReceive('get')
        //     ->andReturn($postGetRecentPostsReturn)
        //     ->once();

        // // // Expect
        // $request->expects($this->once())
        //     ->method('all')
        //     ->willReturn($returnedTagData);
        // // Fire
        // $response = $controller->getRecentPosts($request);
        // // Assert
        // self::assertJson($response);
    }

}
