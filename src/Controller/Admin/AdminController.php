<?php

namespace App\Controller\Admin;

use App\Repository\ChallengeRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

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

    #[Route('/admin/challenge/edit', name: 'admin_challenge_edit', methods: ['UPDATE'])]
    public function editChallenge(Request $request, ValidatorInterface $validator): JsonResponse
    {
        if ($this->isGranted("ROLE_ADMIN")) {
            $queryData = $request->query;
            $challengeId = $queryData->get("challengeId");
            $challengeName = $queryData->get("name");
            $challengeRules = $queryData->get("rules");

            $challengeToEdit = $this->challengeRepo->find($challengeId);

            if ($challengeToEdit) {
                $challengeToEdit->setName($challengeName);
                $challengeToEdit->setRules($challengeRules);

                $errors = [];
                $violations = $validator->validate($challengeToEdit);
                if (count($violations) > 0) {
                    foreach ($violations as $error) {
                        $errors[] = $error;
                    }
                    
                    return $this->json([
                        "error" => $errors[0]->getMessage()
                    ]);
                } else {
                    $this->entityManager->persist($challengeToEdit);
                    $this->entityManager->flush();
    
                    return $this->json([
                        "success" => "Challenge mis à jour"
                    ]);
                }

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

    #[Route('/admin/user/delete', name: 'admin_user_delete', methods: ['DELETE'])]
    public function deleteUser(Request $request, UserRepository $userRepo): JsonResponse
    {
        if ($this->isGranted("ROLE_ADMIN")) {
            $queryData = $request->query;
            $userId = $queryData->get("userId");
            
            $userToDelete = $userRepo->find($userId);

            if($userToDelete) {
                $this->entityManager->remove($userToDelete);
                $this->entityManager->flush();

                return $this->json([
                    "success" => "Compte utilisateur supprimé"
                ]);
            } else {
                return $this->json([
                    "error" => "Utilisateur non trouvé"
                ]);
            }
        } else {
            return $this->json([
                "error" => "Non autorisé"
            ]);
        }
    }
}
