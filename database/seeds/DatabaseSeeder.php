<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(PermissionTableSeeder::class);
        $this->call(RoleTableSeeder::class);
        factory(Product::class, Config::get('constants.seed_data.num_products'))->create();

        $generalPermissions = Permission::whereIn('name', ['home-list', 'book-list', 'user-list', 'tag-list', 'tag-create', 'post-list', 'post-create', 'post-edit', 'post-delete', 'category-list', 'category-create', 'category-edit', 'category-delete'])->get();

        $readerRole = Role::where('name', 'Reader')->first();

        $readerRole->syncPermissions($generalPermissions);

        $userPassword = bcrypt(Config::get('constants.test_user_data.password'));
        Role::all()->each(function($role) use ($userPassword) {

            if($role->name == 'Admin'){

                $user = User::create([
                    'name' => 'test',
                    'email' => 'test@gmail.com',
                    'password' => $userPassword,
                    'is_admin' => true,
                    'active' => true
                ]);

                $user->assignRole($role);
            } else {

                $user = User::create([
                    'name' => 'Reader',
                    'email' => 'Reader@gmail.com',
                    'password' => $userPassword,
                    'active' => true
                ]);

                $user->assignRole($role);
            }
        });
    }
}
