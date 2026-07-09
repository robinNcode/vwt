<?php

namespace App\Repositories\Contracts;

interface ProductRepositoryInterface
{
    public function getAllPaginated(int $perPage = 15);
    public function getActivePaginated(int $perPage = 15);
    public function findById(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
}
