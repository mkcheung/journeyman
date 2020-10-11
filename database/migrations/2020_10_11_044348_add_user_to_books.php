<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUserToBooks extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('books', function (Blueprint $table) {
            $table->string('author_first_name')->nullable(false)->after('title');
            $table->string('author_middle')->nullable(true)->after('author_first_name');
            $table->string('author_last_name')->nullable(false)->after('author_middle');
            $table->bigInteger('user_id')->after('author_last_name');
            $table->dropColumn(['author']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropColumn(['author_first_name', 'author_middle', 'author_last_name', 'user_id']);
            $table->string('author')->nullable(false)->after('title');
        });
    }
}
