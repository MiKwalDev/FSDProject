<?php

namespace App\Controller;

use App\IGDBWrapper\IGDB;
use App\IGDBWrapper\IGDBEndpointException;
use App\IGDBWrapper\IGDBInvalidParameterException;
use App\IGDBWrapper\IGDBQueryBuilder;
use App\IGDBWrapper\IGDBUtils;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'api_')]
class DashboardController extends AbstractController
{
    #[Route('/dashboard', name: 'dashboard')]
    public function index(): Response
    {
        $user = $this->getUser();

        return !$user ? $this->json("Aucun utilisateur") : $this->json($user);
        
        /* try {
            $token = IGDBUtils::authenticate("e4xi3wg152mfprm429eeo7o4w50foi", "4xy7b25c659zezu4pigjam4a2u5kan")->access_token;
        } catch (Exception $e) {
            return $this->json($e->getMessage());
        }

        $igdb = new IGDB("e4xi3wg152mfprm429eeo7o4w50foi", $token);

        try {
            $game = $igdb->game('search "uncharted 4"; fields name,cover; limit 1;');
            $cover = $igdb->cover("fields id,image_id; where id = {$game[0]->cover};");

            try {
                $imgUrl = IGDBUtils::image_url($cover[0]->image_id, "cover_small");
            } catch (Exception $e) {
                return $this->json($e->getMessage());
            }

            $data = [
                "game" => $game[0],
                "imgUrl" => $imgUrl
            ];

            return $this->json($data);
        } catch (IGDBEndpointException $e) {
            return $this->json($e->getMessage());
        } */
    }
}
