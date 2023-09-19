<?php

namespace App\Controller;

use App\IGDBWrapper\IGDB;
use App\IGDBWrapper\IGDBEndpointException;
use App\IGDBWrapper\IGDBUtils;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

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

    #[Route('/dashboard/getuserdata', name: 'dashboard_getuserdata', methods: ['POST'])]
    public function getUserData(): JsonResponse
    {
        $user = $this->getUser();

        if ($user) {
            return $this->json($user, 200, [], ["groups" => ["user"]]);
        } else {
            return $this->json("Aucun utilisateur");
        }
    }

    #[Route('/dashboard/profil/update', name: 'dashboard_profil_update', methods: ['UPDATE'])]
    public function updateProfil(Request $request, EntityManagerInterface $entityManager, UserRepository $userRepo, ValidatorInterface $validator): JsonResponse
    {
        $user = $this->getUser();
        $user = $userRepo->findOneBy(["email" => $user->getUserIdentifier()]);

        if ($user) {
            $queryData = $request->query;

            $user->setUsername($queryData->get("username"));
            $user->setEmail($queryData->get("email"));

            $violations = $validator->validate($user);
            if (count($violations) > 0) {
                foreach ($violations as $error) {
                    $errors[] = $error;
                }
                return $this->json([
                    "error" => $errors[0]->getMessage()
                ]);
            } else {
                $entityManager->persist($user);
                $entityManager->flush();

                return $this->json([
                    "success" => [
                        "newCredentials" => [
                            'userId' => $user->getId(),
                            'username' => $user->getUsername(),
                            'userEmail' => $user->getEmail(),
                            'userCreatedAt' => $user->getCreatedAt(),
                            'roles' => $user->getRoles(),
                        ],
                        "message" => "Modifications effectuées avec succès"
                    ]
                ]);
            }
        } else {
            return $this->json("Aucun utilisateur");
        }
    }

    #[Route('/dashboard/searchgames', name: 'dashboard_searchgames', methods: ['POST'])]
    public function searchGames(Request $request): JsonResponse
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
                    $cover !== null ? $imgUrl2x = $this->igdbUtils->image_url($cover[0]->image_id, "cover_small_2x") : $imgUrl = "noCover";
                } catch (Exception $e) {
                    return $this->json($e->getMessage());
                }

                $data[] = [
                    "gameid" => $game->id,
                    "game" => $game->name,
                    "imgurl" => $imgUrl,
                    "imgurl2x" => $imgUrl2x
                ];
            }

            return $this->json($data);
        } catch (IGDBEndpointException $e) {
            return $this->json($e->getMessage());
        }
    }
}
