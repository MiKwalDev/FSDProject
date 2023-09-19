<?php

namespace App\Controller\Admin;

use App\Repository\ChallengeRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'api_')]
class AdminController extends AbstractController
{
    private $challengeRepo;
    private $entityManager;

    public function __construct(ChallengeRepository $challengeRepo, EntityManagerInterface $entityManager)
    {
        $this->challengeRepo = $challengeRepo;
        $this->entityManager = $entityManager;
    }

    #[Route('/admin', name: 'admin', methods: ['POST'])]
    public function index(): JsonResponse
    {
        if ($this->isGranted("ROLE_ADMIN")) {
            $onPendingChallenges = $this->challengeRepo->findOnPending();

            return $this->json([
                "onPendingChallenges" => $onPendingChallenges
            ], 200, [], ["groups" => ["created_challenges"]]);
        } else {
            return $this->json([
                "error" => "Non autorisé"
            ]);
        }
    }

    #[Route('/admin/challenge/publish', name: 'admin_challenge_publish', methods: ['POST'])]
    public function publish(Request $request): JsonResponse
    {
        if ($this->isGranted("ROLE_ADMIN")) {
            $queryData = $request->query;
            $challengeId = $queryData->get("challengeId");
            $status = $queryData->get("status");

            $challengeToSet = $this->challengeRepo->find($challengeId);

            if ($challengeToSet) {
                $challengeToSet->setStatus($status);

                $this->entityManager->persist($challengeToSet);
                $this->entityManager->flush();

                return $this->json([
                    "success" => "Status mis à jour"
                ]);
            } else {
                return $this->json([
                    "error" => "Challenge introuvable"
                ]);
            }
        } else {
            return $this->json([
                "error" => "Non autorisé"
            ]);
        }
    }

    #[Route('/admin/userslist', name: 'admin_userslist', methods: ['GET'])]
    public function getUsersList(UserRepository $userRepo): JsonResponse
    {
        if ($this->isGranted("ROLE_ADMIN")) {
            $usersList = $userRepo->findAll();

            return $this->json([
                "users" => $usersList
            ], 200, [], ["groups" => ["user"]]);
        } else {
            return $this->json([
                "error" => "Non autorisé"
            ]);
        }
    }
}
