<?php

namespace App\Controller;

use App\IGDBWrapper\IGDB;
use App\IGDBWrapper\IGDBUtils;
use App\Repository\ChallengeRepository;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'api_')]
class GameController extends AbstractController
{
    private $igdbUtils;
    private $igdb;

    public function __construct(IGDBUtils $igdbUtils)
    {
        $this->igdbUtils = $igdbUtils;

        try {
            $token = $this->igdbUtils->authenticate($_ENV['CLIENT_ID'], $_ENV['CLIENT_SECRET'])->access_token;
        } catch (Exception $e) {
            return $this->json($e->getMessage());
        }

        $this->igdb = new IGDB($_ENV['CLIENT_ID'], $token);
    }

    #[Route('/game/getgamedata', name: 'game_getgamedata')]
    public function getGameData(Request $request, ChallengeRepository $challengeRepo): JsonResponse
    {
        $queryData = $request->query;
        $gameId = $queryData->get("gameId");

        if ($gameId) {
            $game = $this->igdb->game("fields id,name,cover; where id = {$gameId};");
            $cover = $this->igdb->cover("fields id,image_id,game; where game = {$game[0]->id};");
            $cover ? $imgUrl = $this->igdbUtils->image_url($cover[0]->image_id, "screenshot_big") : $imgUrl = "noCover";

            $lastChallengesCreated = $challengeRepo->findLastCreatedByGameId(3, $gameId);

            if ($lastChallengesCreated) {
                $lastChallengesToDisplay = [];
                foreach ($lastChallengesCreated as $challenge) {
                    $game = $this->igdb->game("fields id,name,cover; where id = {$challenge->getGameId()};");
    
                    $lastChallengesToDisplay[] = [
                        "id" => $challenge->getId(),
                        "name" => $challenge->getName(),
                        "creator" => $challenge->getCreator() ? $challenge->getCreator()->getUsername() : "Utilisateur supprimé",
                        "gameName" => $game[0]->name,
                        "rules" => $challenge->getRules(),
                        "imgUrl" => $imgUrl
                    ];
                }
            } else {
                $lastChallengesToDisplay = null;
            }

            return $this->json([
                "gameName" => $game[0]->name,
                "imgUrl" => $imgUrl,
                "lastChallengesCreated" => $lastChallengesToDisplay
            ], 200, [], ["groups" => ["created_challenges"]]);
        } else {
            return $this->json([
                "error" => "Jeux non trouvé"
            ]);
        }

    }

    #[Route('/game/getgamecover', name: 'game_getgamecover')]
    public function getGameCover(Request $request): JsonResponse
    {
        $queryData = $request->query;
        $gameId = $queryData->get("gameId");

        if ($gameId) {
            $game = $this->igdb->game("fields cover; where id = {$gameId};");
            $cover = $this->igdb->cover("fields image_id,game; where game = {$game[0]->id};");
            $cover ? $imgUrl = $this->igdbUtils->image_url($cover[0]->image_id, "screenshot_big") : $imgUrl = "noCover";

            return $this->json($imgUrl);
        } else {
            return $this->json([
                "error" => "Jeux non trouvé"
            ]);
        }
    }
}
