<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230904095553 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE tracked_challenge (id INT AUTO_INCREMENT NOT NULL, challenge_id INT NOT NULL, user_id INT NOT NULL, is_done TINYINT(1) NOT NULL, is_abandoned TINYINT(1) NOT NULL, added_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_4D3561E798A21AC6 (challenge_id), INDEX IDX_4D3561E7A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE tracked_challenge ADD CONSTRAINT FK_4D3561E798A21AC6 FOREIGN KEY (challenge_id) REFERENCES challenge (id)');
        $this->addSql('ALTER TABLE tracked_challenge ADD CONSTRAINT FK_4D3561E7A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracked_challenge DROP FOREIGN KEY FK_4D3561E798A21AC6');
        $this->addSql('ALTER TABLE tracked_challenge DROP FOREIGN KEY FK_4D3561E7A76ED395');
        $this->addSql('DROP TABLE tracked_challenge');
    }
}
