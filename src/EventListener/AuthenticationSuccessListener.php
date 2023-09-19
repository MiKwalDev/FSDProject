<?php

namespace App\EventListener;

use App\Repository\ChallengeRepository;
use App\Repository\TrackedChallengeRepository;
use App\Repository\UserGameRepository;
use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\Security\Core\User\UserInterface;

class AuthenticationSuccessListener {
    private $userRepo;
    private $userGameRepo;
    private $challengeRepo;
    private $trackedChallengeRepo;

    public function __construct(UserRepository $userRepo, UserGameRepository $userGameRepo, ChallengeRepository $challengeRepo, TrackedChallengeRepository $trackedChallengeRepo) {
        $this->userRepo = $userRepo;
        $this->userGameRepo = $userGameRepo;
        $this->challengeRepo = $challengeRepo;
        $this->trackedChallengeRepo = $trackedChallengeRepo;
    }

    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event)
    {
        $data = $event->getData();
        $user = $event->getUser();
    
        if (!$user instanceof UserInterface) {
            return;
        }
    
        $user = $this->userRepo->findOneBy(["email" => $user->getUserIdentifier()]);

        $backlog = $this->userGameRepo->findAllByUser($user);
        $backlogGames = [];
        foreach ($backlog as $game) {
            $backlogGames[] = $game->toArray();
        }

        $createdChallenges = $this->challengeRepo->findAllByUser($user);
        $createdChallengesArray = [];
        foreach ($createdChallenges as $challenge) {
            $createdChallengesArray[] = $challenge->toArray();
        }

        $trackedChallenges = $this->trackedChallengeRepo->findAllByUser($user);
        $trackedChallengesArray = [];
        foreach ($trackedChallenges as $challenge) {
            $trackedChallengesArray[] = $challenge->toArray();
        }

        $data['data'] = array(
            'userId' => $user->getId(),
            'username' => $user->getUsername(),
            'userEmail' => $user->getEmail(),
            'userCreatedAt' => $user->getCreatedAt(),
            'roles' => $user->getRoles(),
            'games' => $backlogGames,
            'createdChallenges' => $createdChallengesArray,
            'trackedChallenges' => $trackedChallengesArray
        );
    
        $event->setData($data);
    }
    
}
