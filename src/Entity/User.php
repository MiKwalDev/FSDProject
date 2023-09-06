<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[UniqueEntity(
    fields: ['email'],
    errorPath: "email",
    message: "Il semblerait que vous soyez déjà inscrit avec cet email"
)]
#[UniqueEntity(
    fields: ['username'],
    errorPath: "username",
    message: "Ce nom d'utilisateur est déjà pris"
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    public function __construct()
    {
        $this->created_at = new \DateTimeImmutable();
        $this->userGames = new ArrayCollection();
        $this->created_challenges = new ArrayCollection();
        $this->trackedChallenges = new ArrayCollection();
    }

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["user"])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Assert\NotBlank(message: "Veuillez entrer un email")]
    #[Assert\Email(message: "Veuillez entrer un email valide")]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Assert\NotBlank(message: "Veuillez entrer un mot de passe")]
    #[Assert\Length(
        min: 8,
        minMessage: "Votre mot de passe doit contenir au moins 8 caractères",
    )]
    #[Assert\Regex(
        pattern: "/^([^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/",
        match: false,
        message: 'Votre mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
    )]
    private ?string $password = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Assert\NotBlank(message: "Veuillez entrer un nom d'utilisateur")]
    #[Assert\Length(
        min: 3,
        max: 20,
        minMessage: "Votre nom d'utilisateur doit contenir au moins 3 caractères",
        maxMessage: "Votre nom d'utilisateur ne peut pas exceder 20 caractères",
    )]
    #[Assert\Regex(
        pattern: "/[^\w\d]+/",
        match: false,
        message: "Votre nom d'utilisateur ne peut contenir aucun espace ou caractère spécial",
    )]
    private ?string $username = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: UserGame::class, orphanRemoval: true, fetch: 'EXTRA_LAZY')]
    #[ORM\OrderBy(["added_at" => "DESC"])]
    private Collection $userGames;

    #[ORM\OneToMany(mappedBy: 'creator', targetEntity: Challenge::class, fetch: 'EXTRA_LAZY')]
    #[ORM\OrderBy(["created_at" => "DESC"])]
    private Collection $created_challenges;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: TrackedChallenge::class, orphanRemoval: true)]
    #[ORM\OrderBy(["added_at" => "DESC"])]
    private Collection $trackedChallenges;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

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
     * @return Collection<int, UserGame>
     */
    public function getUserGames(): Collection
    {
        return $this->userGames;
    }

    public function addUserGame(UserGame $userGame): static
    {
        if (!$this->userGames->contains($userGame)) {
            $this->userGames->add($userGame);
            $userGame->setUser($this);
        }

        return $this;
    }

    public function removeUserGame(UserGame $userGame): static
    {
        if ($this->userGames->removeElement($userGame)) {
            // set the owning side to null (unless already changed)
            if ($userGame->getUser() === $this) {
                $userGame->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Challenge>
     */
    public function getCreatedChallenges(): Collection
    {
        return $this->created_challenges;
    }

    public function addCreatedChallenge(Challenge $createdChallenge): static
    {
        if (!$this->created_challenges->contains($createdChallenge)) {
            $this->created_challenges->add($createdChallenge);
            $createdChallenge->setCreator($this);
        }

        return $this;
    }

    public function removeCreatedChallenge(Challenge $createdChallenge): static
    {
        if ($this->created_challenges->removeElement($createdChallenge)) {
            // set the owning side to null (unless already changed)
            if ($createdChallenge->getCreator() === $this) {
                $createdChallenge->setCreator(null);
            }
        }

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
            $trackedChallenge->setUser($this);
        }

        return $this;
    }

    public function removeTrackedChallenge(TrackedChallenge $trackedChallenge): static
    {
        if ($this->trackedChallenges->removeElement($trackedChallenge)) {
            // set the owning side to null (unless already changed)
            if ($trackedChallenge->getUser() === $this) {
                $trackedChallenge->setUser(null);
            }
        }

        return $this;
    }
}
