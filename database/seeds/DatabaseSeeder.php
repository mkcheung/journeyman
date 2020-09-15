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

        $permsForProdManipulation = Permission::whereIn('name', ['home-list', 'product-list', 'product-create', 'product-edit', 'product-delete'])->get();

        $employeeRole = Role::where('name', 'Employee')->first();

        $employeeRole->syncPermissions($permsForProdManipulation);

        $userPassword = bcrypt(Config::get('constants.test_user_data.password'));
        Role::all()->each(function($role) use ($userPassword) {

            if($role->name == 'Admin'){

                $user = User::create([
                    'name' => 'test',
                    'email' => 'test@gmail.com',
                    'password' => $userPassword
                ]);

                $user->assignRole($role);
            } else {

                $user = User::create([
                    'name' => 'testEmployeeRole',
                    'email' => 'testEmployeeRole@gmail.com',
                    'password' => $userPassword
                ]);

                $user->assignRole($role);
            }
        });
    }
}
