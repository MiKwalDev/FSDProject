<?php

namespace App\Controller;

use App\IGDBWrapper\IGDB;
use App\IGDBWrapper\IGDBEndpointException;
use App\IGDBWrapper\IGDBUtils;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

#[Route('/api', name: 'api_')]
class DashboardController extends AbstractController
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

    #[Route('/dashboard', name: 'dashboard', methods: ['POST'])]
    public function index(): Response
    {
        $user = $this->getUser();

        if ($user) {

            return $this->json($user, Response::HTTP_OK, [], [ObjectNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($obj) {
                return $obj->getId();
            }]);
        } else {
            return $this->json("Aucun utilisateur");
        }
    }

    #[Route('/dashboard/searchgames', name: 'dashboard_searchgames', methods: ['POST'])]
    public function searchGames(Request $request): Response
    {
        $query = $request->query;
        $gameName = $query->get("gameName");

        try {
            $games = $this->igdb->game('search "'.$gameName.'" ; fields id,name,cover;');
            
            $data = [];
            foreach ($games as $game) {
                isset($game->cover) ? $cover = $this->igdb->cover("fields id,image_id; where id = {$game->cover};") : $cover = null;

                try {
                    $cover !== null ? $imgUrl = $this->igdbUtils->image_url($cover[0]->image_id, "cover_small") : $imgUrl = "noCover";
                } catch (Exception $e) {
                    return $this->json($e->getMessage());
                }

                $data[] = [
                    "gameid" => $game->id,
                    "game" => $game->name,
                    "imgurl" => $imgUrl
                ];
            }

            return $this->json($data);
        } catch (IGDBEndpointException $e) {
            return $this->json($e->getMessage());
        }
    }
}
