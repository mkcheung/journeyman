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
}
