<?php

namespace App\Controller\Admin;

use App\Repository\ChallengeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

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
    public function index(): Response
    {
        if ($this->isGranted("ROLE_ADMIN")) {
            $onPendingChallenges = $this->challengeRepo->findOnPending();

            return $this->json([
                "onPendingChallenges" => $onPendingChallenges
            ], Response::HTTP_OK, [], [ObjectNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($obj) {
                return $obj->getId();
            }]);
        }

        return $this->json("test");
    }

    #[Route('/admin/challenge/publish', name: 'admin_challenge_publish', methods: ['POST'])]
    public function publish(Request $request): Response
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
        }
    }
}
