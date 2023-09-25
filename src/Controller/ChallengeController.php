<?php

namespace App\Controller;

use App\Entity\Challenge;
use App\Entity\TrackedChallenge;
use App\IGDBWrapper\IGDB;
use App\IGDBWrapper\IGDBUtils;
use App\Repository\ChallengeRepository;
use App\Repository\TrackedChallengeRepository;
use App\Repository\UserGameRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api', name: 'api_')]
class ChallengeController extends AbstractController
{
    private $entityManager;
    private $challengeRepo;
    private $igdbUtils;
    private $igdb;

    public function __construct(EntityManagerInterface $entityManager, ChallengeRepository $challengeRepo, IGDBUtils $igdbUtils)
    {
        $this->entityManager = $entityManager;
        $this->challengeRepo = $challengeRepo;

        $this->igdbUtils = $igdbUtils;

        try {
            $token = $this->igdbUtils->authenticate($_ENV['CLIENT_ID'], $_ENV['CLIENT_SECRET'])->access_token;
        } catch (Exception $e) {
            return $this->json($e->getMessage());
        }

        $this->igdb = new IGDB($_ENV['CLIENT_ID'], $token);
    }

    #[Route('/challenge/search', name: 'challenge_search', methods: ['GET'])]
    public function searchChallenges(Request $request) : JsonResponse
    {
        $queryData = $request->query;
        $keyWord = $queryData->get("search");

        $challenges = $this->challengeRepo->findByKeyWord($keyWord);

        if ($challenges) {
            $findChallenges = [];
            foreach ($challenges as $challenge) {
                $game = $this->igdb->game("fields name; where id = {$challenge->getGameId()};");

                $findChallenges[] = [
                    "challengeId" => $challenge->getId(),
                    "challengeName" => $challenge->getName(),
                    "challengeGame" => $game[0]->name,
                ];
            }

            return $this->json([
                "challenges" => $findChallenges,
                "keyWord" => $keyWord
            ], 200, [], ["groups" => ["created_challenges"]]);
        } else {
            return $this->json([
                "error" => "Aucun challenge trouvé"
            ]);
        }
    }

    #[Route('/challenge/getchallengedata', name: 'challenge_getchallengedata', methods: ['GET'])]
    public function getChallengeData(Request $request): JsonResponse
    {
        $user = $this->getUser();
        
        $queryData = $request->query;
        $challengeId = $queryData->get("challengeId");

        $challenge = $this->challengeRepo->find($challengeId);

        if ($challenge) {

            if (
                ($challenge->getStatus() === "private" || $challenge->getStatus() === "pending")
                && (!$user || $challenge->getCreator() !== $user)
                && (!$this->isGranted("ROLE_ADMIN"))
            ) {
                return $this->json("Page inaccessible");
            } else {
                $game = $this->igdb->game("fields id,name,cover; where id = {$challenge->getGameId()};");
                $cover = $this->igdb->cover("fields id,image_id,game; where game = {$game[0]->id};");
                $cover ? $imgUrl = $this->igdbUtils->image_url($cover[0]->image_id, "screenshot_big") : $imgUrl = "noCover";
                $cover ? $imgUrl2x = $this->igdbUtils->image_url($cover[0]->image_id, "cover_small_2x") : $imgUrl = "noCover";

                return $this->json([
                    "challenge" => $challenge,
                    "gameName" => $game[0]->name,
                    "imgUrl" => $imgUrl,
                    "imgUrl2x" => $imgUrl2x,
                ], 200, [], ["groups" => ["created_challenges"]]);
            }

        } else {
            return $this->json("Challenge non trouvé");
        }
    }

    #[Route('/dashboard/challenge/create', name: 'dashboard_challenge_create', methods: ['POST'])]
    public function create(Request $request, ValidatorInterface $validator): JsonResponse
    {
        $user = $this->getUser();

        if ($user) {
            $queryData = $request->query;

            $name = $queryData->get("name");
            $rules = htmlspecialchars($queryData->get("rules"), ENT_COMPAT);
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
                    "error" => $errors[0]->getMessage()
                ]);
            } else {
                $this->entityManager->persist($challenge);
                $this->entityManager->flush();

                if ($challenge->getStatus() === "private" ) {
                    return $this->json([
                        "success" => ["Challenge créé avec succès"],
                        "challengeId" => $challenge->getId(),
                        "challengeCreatedAt" => $challenge->getCreatedAt()
                    ]);
                } else {
                    return $this->json([
                        "success" => ["Challenge créé avec succès, il sera rendu publique lorsqu'il aura été vérifié par nos modérateurs"],
                        "challengeId" => $challenge->getId(),
                        "challengeCreatedAt" => $challenge->getCreatedAt()
                    ]);
                }
            }
        } else {
            return $this->json("Aucun utilisateur trouvé! Vous devez être connecté pour cette fonctionnalité.");
        }
    }

    #[Route('/dashboard/challenge/addtotracked', name: 'dashboard_challenge_addtotracked', methods: ['POST'])]
    public function addToTracked(Request $request, TrackedChallengeRepository $trackedChallengeRepo, UserGameRepository $backlogRepo): JsonResponse
    {
        $user = $this->getUser();

        if ($user) {
            $queryData = $request->query;

            $challenge = $this->challengeRepo->find($queryData->get("challengeId"));

            $exists = $trackedChallengeRepo->isAllreadyIn($user, $challenge);

            if ($exists === false) {
                $isGameInBacklog = $backlogRepo->isAllreadyIn($user, $challenge->getGameId());

                if ($isGameInBacklog === false) {
                    return $this->json(["error" => "Ce jeux n'existe pas dans ton backlog"]);
                }

                $trackedChallenge = new TrackedChallenge();
                $trackedChallenge->setChallenge($challenge);
                $trackedChallenge->setUser($user);

                $this->entityManager->persist($trackedChallenge);
                $this->entityManager->flush();

                return $this->json([
                    "success" => "Le challenge à été ajouté à tes challenges en cours",
                    "trackedChallengeId" => $trackedChallenge->getId(),
                    "challenge" => [
                        "id" => $trackedChallenge->getChallenge()->getId(),
                        "name" => $trackedChallenge->getChallenge()->getName(),
                        "gameId" => $trackedChallenge->getChallenge()->getGameId(),
                    ],
                    "trackedChallengeAddedAt" => $trackedChallenge->getAddedAt(),
                ], 200, [], ["groups" => ["created_challenges"]]);
            } else {
                return $this->json(["error" => "Tu as déjà ajouté ce challenge"]);
            }
        } else {
            return $this->json("Aucun utilisateur trouvé! Vous devez être connecté pour cette fonctionnalité.");
        }
    }
}
