<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'api_')]
class UsersListController extends AbstractController
{
    #[Route('/users', name: 'users', methods: ['GET'])]
    public function index(UserRepository $userRepo): JsonResponse
    {
        $users = $userRepo->findAll();

        return $this->json($users);
    }
}
