<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddImageToPost extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('path')->nullable(true);
            $table->string('name')->nullable(true);
            $table->string('type')->nullable(true);
        });
        DB::statement("ALTER TABLE posts ADD image LONGBLOB");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['image']);
            $table->dropColumn(['path']);
            $table->dropColumn(['name']);
            $table->dropColumn(['type']);
        });
    }
}
