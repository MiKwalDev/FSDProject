<?php

namespace App\Controller;

use App\Entity\UserGame;
use App\IGDBWrapper\IGDB;
use App\IGDBWrapper\IGDBEndpointException;
use App\IGDBWrapper\IGDBUtils;
use App\Repository\ChallengeRepository;
use App\Repository\UserGameRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

#[Route('/api', name: 'api_')]
class BacklogController extends AbstractController
{
    private $igdbUtils;
    private $igdb;
    private $entityManager;

    public function __construct(IGDBUtils $igdbUtils, EntityManagerInterface $entityManager)
    {
        $this->igdbUtils = $igdbUtils;
        $this->entityManager = $entityManager;

        try {
            $token = $this->igdbUtils->authenticate($_ENV['CLIENT_ID'], $_ENV['CLIENT_SECRET'])->access_token;
        } catch (Exception $e) {
            return $this->json($e->getMessage());
        }

        $this->igdb = new IGDB($_ENV['CLIENT_ID'], $token);
    }
    
    #[Route('/dashboard/backlog/addgame', name: 'dashboard_backlog_addgame', methods: ['POST'])]
    public function addGame(UserGameRepository $ugRepo, Request $request): Response
    {
        $user = $this->getUser();

        if ($user) {
            $queryData = $request->query;

            $exists = $ugRepo->isAllreadyIn($user, $queryData->get("gameId"));
            
            if ($exists === false) {
                $userGame = new UserGame();
                $userGame->setUser($user);
                $userGame->setGameId($queryData->get("gameId"));
                $userGame->setGameName($queryData->get("gameName"));
                $userGame->setGameCoverUrl($queryData->get("gameCover"));
    
                $this->entityManager->persist($userGame);
                $this->entityManager->flush();
    
                return $this->json(["success" => "Le jeu à été ajouté à ton backlog"]);
            } else {
                return $this->json(["error" => "Tu as déjà ajouté ce jeu"]);
            }
        } else {
            return $this->json("Aucun utilisateur trouvé");
        }
    }

    #[Route("/dashboard/backlog/game", name: 'dashboard_backlog_game', methods: ['GET'])]
    public function getGameInfos(Request $request): Response
    {
        $query = $request->query;
        $gameId = $query->get("gameId");

        try {
            $cover = $this->igdb->cover("fields id,image_id,game; where game = {$gameId};");
            $cover ? $imgUrl = $this->igdbUtils->image_url($cover[0]->image_id, "screenshot_big") : $imgUrl = "noCover";

            return $this->json([
                "imgUrl" => $imgUrl
            ], Response::HTTP_OK, [], [ObjectNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($obj) {
                return $obj->getId();
            }]);
        } catch (IGDBEndpointException $e) {
            return $this->json($e->getMessage());
        }
    }
}
