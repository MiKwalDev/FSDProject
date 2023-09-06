<?php

namespace App\Controller;

use App\Entity\Challenge;
use App\Entity\TrackedChallenge;
use App\Repository\ChallengeRepository;
use App\Repository\TrackedChallengeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api', name: 'api_')]
class ChallengeController extends AbstractController
{
    private $entityManager;
    private $challengeRepo;
    

    public function __construct(EntityManagerInterface $entityManager, ChallengeRepository $challengeRepo)
    {
        $this->entityManager = $entityManager;
        $this->challengeRepo = $challengeRepo;
        
    }

    #[Route('/dashboard/challenge/create', name: 'dashboard_challenge_create', methods: ['POST'])]
    public function create(Request $request, ValidatorInterface $validator): Response
    {
        $user = $this->getUser();

        if ($user) {
            $queryData = $request->query;

            $name = $queryData->get("name");
            $rules = htmlspecialchars($queryData->get("rules"));
            $status = $queryData->get("status");
            $gameId = $queryData->get("gameId");

            $challenge = new Challenge();

            $challenge->setName($name);
            $challenge->setRules($rules);
            $status === "public" ? $challenge->setStatus("pending") : $challenge->setStatus($status);
            $challenge->setGameId($gameId);
            $challenge->setCreator($user);

            $errors = [];
            $violations = $validator->validate($challenge);
            if (count($violations) > 0) {
                foreach ($violations as $error) {
                    $errors[] = $error;
                }
                return $this->json([
                    "errors" => $errors
                ], Response::HTTP_OK, [], [ObjectNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($obj) {
                    return $obj->getId();
                }]);
            } else {
                $this->entityManager->persist($challenge);
                $this->entityManager->flush();

                return $this->json([
                    "success" => ["Challenge créé avec succès"],
                    "challengeId" => $challenge->getId(),
                    "challengeCreatedAt" => $challenge->getCreatedAt()
                ]);
            }
        } else {
            return $this->json("Aucun utilisateur trouvé! Vous devez être connecté pour cette fonctionnalité.");
        }
    }

    #[Route('/dashboard/challenge/addtotracked', name: 'dashboard_challenge_addtotracked', methods: ['POST'])]
    public function addToTracked(Request $request, TrackedChallengeRepository $trackedChallengeRepo) : Response
    {
        $user = $this->getUser();

        if ($user) {
            $queryData = $request->query;

            $challenge = $this->challengeRepo->find($queryData->get("challengeId"));

            $exists = $trackedChallengeRepo->isAllreadyIn($user, $challenge);

            if ($exists === false) {
                $trackedChallenge = new TrackedChallenge();
                $trackedChallenge->setChallenge($challenge);
                $trackedChallenge->setUser($user);

                $this->entityManager->persist($trackedChallenge);
                $this->entityManager->flush();

                return $this->json([
                    "success" => "Le challenge à été ajouté à tes challenges en cours",
                    "trackedChallengeId" => $trackedChallenge->getId(),
                    "challenge" => $trackedChallenge->getChallenge(),
                    "trackedChallengeAddedAt" => $trackedChallenge->getAddedAt(),
                ], Response::HTTP_OK, [], [ObjectNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($obj) {
                    return $obj->getId();
                }]);
            }else {
                return $this->json(["error" => "Tu as déjà ajouté ce challenge"]);
            }
        } else {
            return $this->json("Aucun utilisateur trouvé! Vous devez être connecté pour cette fonctionnalité.");
        }
    }
}
