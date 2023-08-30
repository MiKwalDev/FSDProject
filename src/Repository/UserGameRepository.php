<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\UserGame;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserGame>
 *
 * @method UserGame|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserGame|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserGame[]    findAll()
 * @method UserGame[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserGameRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserGame::class);
    }

    public function findAllByUser(User $user)
    {
        return $this->createQueryBuilder('ug')
            ->andWhere('ug.user = :user')
            ->setParameter(':user', $user)
            ->orderBy('ug.added_at', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }

    public function isAllreadyIn(User $user, int $gameId)
    {
        return (boolean)$this->createQueryBuilder('ug')
            ->andWhere('ug.user = :user')
            ->andWhere('ug.game_id = :game_id')
            ->setParameter(':user', $user)
            ->setParameter(':game_id', $gameId)
            ->getQuery()
            ->getOneOrNullResult();
    }

//    /**
//     * @return UserGame[] Returns an array of UserGame objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('u.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?UserGame
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
