<?php

namespace App\Controller;

use App\Entity\UserGame;
use App\Repository\UserGameRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'api_')]
class BacklogController extends AbstractController
{
    #[Route('/dashboard/backlog/addgame', name: 'dashboard_backlog_addgame', methods: ['POST'])]
    public function addGame(Request $request, EntityManagerInterface $entityManager, UserGameRepository $ugRepo): Response
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
    
                $entityManager->persist($userGame);
                $entityManager->flush();
    
                return $this->json(["success" => "Le jeu à été ajouté à ton backlog"]);
            } else {
                return $this->json(["error" => "Tu as déjà ajouté ce jeu"]);
            }
        } else {
            return $this->json("Aucun utilisateur trouvé");
        }
    }
}
