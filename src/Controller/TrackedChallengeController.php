<?php

namespace App\Controller;

use App\Repository\TrackedChallengeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'api_')]
class TrackedChallengeController extends AbstractController
{
    private $entityManager;
    private $trackedChallengeRepo;

    public function __construct(EntityManagerInterface $entityManager, TrackedChallengeRepository $trackedChallengeRepo)
    {
        $this->entityManager = $entityManager;
        $this->trackedChallengeRepo = $trackedChallengeRepo;
    }
    
    #[Route('/dashboard/trackedchallenge/toggleisdone', name: 'dashboard_trackedchallenge_toggleisdone', methods: ['POST'])]
    public function toggleIsDone(Request $request) : Response
    {
        $user = $this->getUser();

        if ($user) {
            $queryData = $request->query;

            $trackedChallenge = $this->trackedChallengeRepo->find($queryData->get("trackedChallengeId"));

            if ($trackedChallenge) {
                $trackedChallenge->setIsDone(!$trackedChallenge->isIsDone());

                $this->entityManager->persist($trackedChallenge);
                $this->entityManager->flush();

                return $this->json(["success" => "Status changé"]);
            }else {
                return $this->json(["error" => "Challenge non trouvé"]);
            }
        } else {
            return $this->json("Aucun utilisateur trouvé! Vous devez être connecté pour cette fonctionnalité.");
        }
    }

    #[Route('/dashboard/trackedchallenge/toggleisabandoned', name: 'dashboard_trackedchallenge_toggleisabandoned', methods: ['POST'])]
    public function toggleIsAbandoned(Request $request) : Response
    {
        $user = $this->getUser();

        if ($user) {
            $queryData = $request->query;

            $trackedChallenge = $this->trackedChallengeRepo->find($queryData->get("trackedChallengeId"));

            if ($trackedChallenge) {
                $trackedChallenge->setIsAbandoned(!$trackedChallenge->isIsAbandoned());

                $this->entityManager->persist($trackedChallenge);
                $this->entityManager->flush();

                return $this->json(["success" => "Status changé"]);
            }else {
                return $this->json(["error" => "Challenge non trouvé"]);
            }
        } else {
            return $this->json("Aucun utilisateur trouvé! Vous devez être connecté pour cette fonctionnalité.");
        }
    }

    #[Route('/dashboard/trackedchallenge/delete', name: 'dashboard_trackedchallenge_delete', methods: ['DELETE'])]
    public function delete(Request $request) : Response
    {
        $user = $this->getUser();

        if ($user) {
            $queryData = $request->query;

            $trackedChallenge = $this->trackedChallengeRepo->find($queryData->get("trackedChallengeId"));

            if ($trackedChallenge) {

                $this->entityManager->remove($trackedChallenge);
                $this->entityManager->flush();

                return $this->json(["success" => "Suppression efféctuée"]);
            }else {
                return $this->json(["error" => "Challenge non trouvé"]);
            }
        } else {
            return $this->json("Aucun utilisateur trouvé! Vous devez être connecté pour cette fonctionnalité.");
        }
    }
}
