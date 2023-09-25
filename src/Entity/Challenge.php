<?php

namespace App\Entity;

use App\Repository\ChallengeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use phpDocumentor\Reflection\Types\Nullable;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ChallengeRepository::class)]
class Challenge
{
    public function __construct()
    {
        $this->created_at = new \DateTimeImmutable();
        $this->trackedChallenges = new ArrayCollection();
    }

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["created_challenges"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Veuillez entrer un nom")]
    #[Assert\Regex(
        pattern: "/[^ A-zÀ-ú\d%]+/",
        match: false,
        message: "Le nom ne peut pas contenir de caractère spécial",
    )]
    #[Groups(["created_challenges"])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Assert\NotBlank(message: "Veuillez entrer la/les règles(s)")]
    #[Groups(["created_challenges"])]
    private ?string $rules = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Veuillez choisir la visibilité du challenge")]
    #[Groups(["created_challenges"])]
    private ?string $status = null;

    #[ORM\ManyToOne(inversedBy: 'created_challenges', fetch: 'EXTRA_LAZY')]
    #[ORM\JoinColumn(nullable: true, onDelete: "SET NULL")]
    #[Groups(["created_challenges"])]
    private ?User $creator = null;

    #[ORM\Column]
    #[Groups(["created_challenges"])]
    private ?int $game_id = null;

    #[ORM\Column]
    #[Groups(["created_challenges"])]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\OneToMany(mappedBy: 'challenge', targetEntity: TrackedChallenge::class, orphanRemoval: true)]
    private Collection $trackedChallenges;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getRules(): ?string
    {
        return $this->rules;
    }

    public function setRules(string $rules): static
    {
        $this->rules = $rules;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getCreator(): ?User
    {
        return $this->creator;
    }

    public function setCreator(?User $creator): static
    {
        $this->creator = $creator;

        return $this;
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

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    /**
     * @return Collection<int, TrackedChallenge>
     */
    public function getTrackedChallenges(): Collection
    {
        return $this->trackedChallenges;
    }

    public function addTrackedChallenge(TrackedChallenge $trackedChallenge): static
    {
        if (!$this->trackedChallenges->contains($trackedChallenge)) {
            $this->trackedChallenges->add($trackedChallenge);
            $trackedChallenge->setChallenge($this);
        }

        return $this;
    }

    public function removeTrackedChallenge(TrackedChallenge $trackedChallenge): static
    {
        if ($this->trackedChallenges->removeElement($trackedChallenge)) {
            // set the owning side to null (unless already changed)
            if ($trackedChallenge->getChallenge() === $this) {
                $trackedChallenge->setChallenge(null);
            }
        }

        return $this;
    }

    public function toArray()
    {
        return [
            'id' => $this->getId(),
            'name' => $this->name,
            'rules' => $this->rules,
            'status' => $this->status,
            'creatorId' => $this->creator->getId(),
            'gameId' => $this->game_id
        ];
    }
}
