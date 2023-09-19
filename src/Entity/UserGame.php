<?php

namespace App\Entity;

use App\Repository\UserGameRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserGameRepository::class)]
class UserGame
{
    public function __construct()
    {
        $this->added_at = new \DateTimeImmutable();
    }

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["userGames"])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(["userGames"])]
    private ?int $game_id = null;

    #[ORM\ManyToOne(inversedBy: 'userGames', fetch: 'EXTRA_LAZY')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column]
    #[Groups(["userGames"])]
    private ?\DateTimeImmutable $added_at = null;

    #[ORM\Column(length: 255)]
    #[Groups(["userGames"])]
    private ?string $game_name = null;

    #[ORM\Column(nullable: false)]
    #[Groups(["userGames"])]
    private ?string $game_cover_url = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getGameId(): ?int
    {
        return $this->game_id;
    }

    public function setGameId(int $game_id): static
    {
        $this->game_id = $game_id;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getAddedAt(): ?\DateTimeImmutable
    {
        return $this->added_at;
    }

    public function setAddedAt(\DateTimeImmutable $added_at): static
    {
        $this->added_at = $added_at;

        return $this;
    }

    public function getGameName(): ?string
    {
        return $this->game_name;
    }

    public function setGameName(string $game_name): static
    {
        $this->game_name = $game_name;

        return $this;
    }

    public function getGameCoverUrl(): ?string
    {
        return $this->game_cover_url;
    }

    public function setGameCoverUrl(?string $game_cover_url): static
    {
        $this->game_cover_url = $game_cover_url;

        return $this;
    }

    public function toArray()
    {
        return [
            'id' => $this->getId(),
            'gameId' => $this->game_id,
            'gameName' => $this->game_name,
            'gameCoverUrl' => $this->game_cover_url,
            'user' => $this->user->getId(),
            'addedAt' => $this->added_at
        ];
    }
}
