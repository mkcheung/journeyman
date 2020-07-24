<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChainOfThoughtPostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chain_of_thought_posts', function (Blueprint $table) {
            $table->bigInteger('chain_of_thought_id')->unsigned();
            $table->bigInteger('post_id')->unsigned();
            $table->foreign('chain_of_thought_id')->references('id')->on('chain_of_thoughts')
                ->onDelete('cascade');
            $table->foreign('post_id')->references('id')->on('posts')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('chain_of_thought_posts');
    }
}
