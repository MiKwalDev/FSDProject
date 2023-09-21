<?php

namespace App\Repository;

use App\Entity\Challenge;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Challenge>
 *
 * @method Challenge|null find($id, $lockMode = null, $lockVersion = null)
 * @method Challenge|null findOneBy(array $criteria, array $orderBy = null)
 * @method Challenge[]    findAll()
 * @method Challenge[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ChallengeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Challenge::class);
    }

    public function findByKeyWord(string $keyWord)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.name LIKE :keyWord')
            ->orWhere('c.rules LIKE :keyWord')
            ->andWhere("c.status = 'public'")
            ->setParameter(':keyWord', "%$keyWord%")
            ->getQuery()
            ->getResult();
    }

    public function findAllByUser(User $user)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.creator = :user')
            ->setParameter(':user', $user)
            ->orderBy('c.created_at', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }

    public function findCreatedByUserAndGame(User $user, int $gameId)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.game_id = :game_id')
            ->setParameter(':game_id', $gameId)
            ->leftJoin("c.creator", "creator")
            ->andWhere('c.creator = :creator')
            ->setParameter(':creator', $user)
            ->getQuery()
            ->getResult();
    }

    public function findOnPending()
    {
        return $this->createQueryBuilder('c')
            ->andWhere("c.status = 'pending'")
            ->getQuery()
            ->getResult();
    }

    public function findGamesWithMostChallenges()
    {
        return $this->createQueryBuilder('c')
            ->select('c.game_id')
            ->andWhere("c.status = 'public'")
            ->addSelect('COUNT(c.id) as challenges')
            ->groupBy('c.game_id')
            ->orderBy('challenges', 'DESC')
            ->setMaxResults(5)
            ->getQuery()
            ->getResult();
    }

    public function findLastCreated(int $number)
    {
        return $this->createQueryBuilder('c')
            ->andWhere("c.status = 'public'")
            ->orderBy('c.created_at', 'DESC')
            ->setMaxResults($number)
            ->getQuery()
            ->getResult();
    }

    public function findLastCreatedByGameId(int $number, int $gameId)
    {
        return $this->createQueryBuilder('c')
            ->andWhere("c.status = 'public'")
            ->andWhere("c.game_id = :gameId")
            ->setParameter(":gameId", $gameId)
            ->orderBy('c.created_at', 'DESC')
            ->setMaxResults($number)
            ->getQuery()
            ->getResult();
    }

//    /**
//     * @return Challenge[] Returns an array of Challenge objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('c.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Challenge
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
