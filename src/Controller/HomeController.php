<?php

namespace App\Controller;

use App\IGDBWrapper\IGDB;
use App\IGDBWrapper\IGDBUtils;
use App\Repository\ChallengeRepository;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

#[Route('/api', name: 'api_')]
class HomeController extends AbstractController
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

    #[Route('/home/homedata', name: 'home_homedata', methods: ['GET'])]
    public function getHomeData(ChallengeRepository $challengeRepo): Response
    {
        $lastChallengesCreated = $challengeRepo->findLastCreated(3);
        $popularGamesIdAndChallengesCount = $challengeRepo->findGamesWithMostChallenges();

        $popularGames = [];
        foreach ($popularGamesIdAndChallengesCount as $data) {
            $game = $this->igdb->game("fields id,name,cover; where id = {$data["game_id"]};");
            $cover = $this->igdb->cover("fields id,image_id,game; where game = {$data["game_id"]};");
            $cover ? $imgUrl = $this->igdbUtils->image_url($cover[0]->image_id, "cover_small_2x") : $imgUrl = "noCover";

            $popularGames[] = [
                "gameId" => $data["game_id"],
                "gameName" => $game[0]->name,
                "imgurl" => $imgUrl,
                "challengeCount" => $data["challenges"]
            ];
        }

        $lastChallengesToDisplay = [];
        foreach ($lastChallengesCreated as $challenge) {
            $game = $this->igdb->game("fields id,name,cover; where id = {$challenge->getGameId()};");
            $cover = $this->igdb->cover("fields id,image_id,game; where game = {$challenge->getGameId()};");
            $cover ? $imgUrl = $this->igdbUtils->image_url($cover[0]->image_id, "screenshot_big") : $imgUrl = "noCover";

            $lastChallengesToDisplay[] = [
                "id" => $challenge->getId(),
                "name" => $challenge->getName(),
                "creator" => $challenge->getCreator()->getUsername(),
                "gameName" => $game[0]->name,
                "rules" => $challenge->getRules(),
                "imgUrl" => $imgUrl
            ];
        }

        return $this->json([
            "popularGames" => $popularGames,
            "lastChallengesCreated" => $lastChallengesToDisplay
        ], Response::HTTP_OK, [], [ObjectNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($obj) {
            return $obj->getId();
        }]);
    }
}
