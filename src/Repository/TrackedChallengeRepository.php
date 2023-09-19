<?php

namespace App\Repository;

use App\Entity\Challenge;
use App\Entity\TrackedChallenge;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TrackedChallenge>
 *
 * @method TrackedChallenge|null find($id, $lockMode = null, $lockVersion = null)
 * @method TrackedChallenge|null findOneBy(array $criteria, array $orderBy = null)
 * @method TrackedChallenge[]    findAll()
 * @method TrackedChallenge[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TrackedChallengeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TrackedChallenge::class);
    }

    public function findAllByUser(User $user)
    {
        return $this->createQueryBuilder('tc')
            ->andWhere('tc.user = :user')
            ->setParameter(':user', $user)
            ->orderBy('tc.added_at', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }

    public function isAllreadyIn(User $user, Challenge $challenge)
    {
        return (boolean)$this->createQueryBuilder('tc')
            ->andWhere('tc.user = :user')
            ->andWhere('tc.challenge = :challenge')
            ->setParameter(':user', $user)
            ->setParameter(':challenge', $challenge)
            ->getQuery()
            ->getOneOrNullResult();
    }

//    /**
//     * @return TrackedChallenge[] Returns an array of TrackedChallenge objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('t.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?TrackedChallenge
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
