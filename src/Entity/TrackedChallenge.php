<?php

namespace App\Entity;

use App\Repository\TrackedChallengeRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TrackedChallengeRepository::class)]
class TrackedChallenge
{
    public function __construct()
    {
        $this->added_at = new \DateTimeImmutable();
        $this->is_done = false;
        $this->is_abandoned = false;
    }

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["tracked_challenges"])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'trackedChallenges')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["tracked_challenges"])]
    private ?Challenge $challenge = null;

    #[ORM\ManyToOne(inversedBy: 'trackedChallenges')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["tracked_challenges"])]
    private ?User $user = null;

    #[ORM\Column]
    #[Groups(["tracked_challenges"])]
    private ?bool $is_done = null;

    #[ORM\Column]
    #[Groups(["tracked_challenges"])]
    private ?bool $is_abandoned = null;

    #[ORM\Column]
    #[Groups(["tracked_challenges"])]
    private ?\DateTimeImmutable $added_at = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getChallenge(): ?Challenge
    {
        return $this->challenge;
    }

    public function setChallenge(?Challenge $challenge): static
    {
        $this->challenge = $challenge;

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

    public function isIsDone(): ?bool
    {
        return $this->is_done;
    }

    public function setIsDone(bool $is_done): static
    {
        $this->is_done = $is_done;

        return $this;
    }

    public function isIsAbandoned(): ?bool
    {
        return $this->is_abandoned;
    }

    public function setIsAbandoned(bool $is_abandoned): static
    {
        $this->is_abandoned = $is_abandoned;

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
}
