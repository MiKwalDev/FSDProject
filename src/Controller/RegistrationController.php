<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api', name: 'api_')]
class RegistrationController extends AbstractController
{
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function index(EntityManagerInterface $entityManager, Request $request, UserPasswordHasherInterface $passwordHasher, ValidatorInterface $validator): Response
    {
        $decoded = json_decode($request->getContent());
        $email = $decoded->email;
        $username = $decoded->username;
        $plaintextPassword = $decoded->password;
        $plaintextPasswordConfirm = $decoded->passwordConfirm;

        $errors = [];
        if ($plaintextPassword !== $plaintextPasswordConfirm) {
            $errors[] = ["message" => "Veillez à bien confirmer votre mot de passe correctement"];

            return $this->json([
                "errors" => $errors
            ]);
        }

        $user = new User();

        $user->setPassword($plaintextPassword);
        $user->setEmail($email);
        $user->setUsername($username);

        $violations = $validator->validate($user);
        if (count($violations) > 0) {
            foreach ($violations as $error) {
                $errors[] = $error;
            }
            return $this->json([
                "errors" => $errors
            ]);
        }
        else {
            $hashedPassword = $passwordHasher->hashPassword(
                $user,
                $plaintextPassword
            );
            $user->setPassword($hashedPassword);

            $entityManager->persist($user);
            $entityManager->flush();
        }

        return $this->json([
            "success" => true
        ]);
    }
}
