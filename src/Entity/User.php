<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
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
    }

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
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

    public function getCreateAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreateAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }
}
