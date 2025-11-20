import {MigrationInterface, QueryRunner} from "typeorm";

export class Inicial1763656989934 implements MigrationInterface {
    name = 'Inicial1763656989934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`bio\` varchar(255) NOT NULL DEFAULT '', \`image\` varchar(255) NOT NULL DEFAULT '', \`password\` varchar(255) NOT NULL, \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`manutencao\` (\`id\` int NOT NULL AUTO_INCREMENT, \`body\` varchar(255) NOT NULL, \`custo\` int NOT NULL, \`bicicletaId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`bicicleta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NOT NULL, \`modelo\` varchar(255) NOT NULL, \`marca\` varchar(255) NOT NULL, \`cor\` varchar(255) NOT NULL, \`aro\` int NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'nova', \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`favoriteCount\` int NOT NULL DEFAULT '0', \`authorId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_favorites_bicicleta\` (\`userId\` int NOT NULL, \`bicicletaId\` int NOT NULL, INDEX \`IDX_5cc7106a777c1d93f281324696\` (\`userId\`), INDEX \`IDX_9dfc42ab2f4de1ad22140cbd8c\` (\`bicicletaId\`), PRIMARY KEY (\`userId\`, \`bicicletaId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`manutencao\` ADD CONSTRAINT \`FK_e988aea1ce6f32ffdfe8c000135\` FOREIGN KEY (\`bicicletaId\`) REFERENCES \`bicicleta\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bicicleta\` ADD CONSTRAINT \`FK_3fa92a7ccf78100eb734168d16f\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_favorites_bicicleta\` ADD CONSTRAINT \`FK_5cc7106a777c1d93f2813246968\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_favorites_bicicleta\` ADD CONSTRAINT \`FK_9dfc42ab2f4de1ad22140cbd8c1\` FOREIGN KEY (\`bicicletaId\`) REFERENCES \`bicicleta\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_favorites_bicicleta\` DROP FOREIGN KEY \`FK_9dfc42ab2f4de1ad22140cbd8c1\``);
        await queryRunner.query(`ALTER TABLE \`user_favorites_bicicleta\` DROP FOREIGN KEY \`FK_5cc7106a777c1d93f2813246968\``);
        await queryRunner.query(`ALTER TABLE \`bicicleta\` DROP FOREIGN KEY \`FK_3fa92a7ccf78100eb734168d16f\``);
        await queryRunner.query(`ALTER TABLE \`manutencao\` DROP FOREIGN KEY \`FK_e988aea1ce6f32ffdfe8c000135\``);
        await queryRunner.query(`DROP INDEX \`IDX_9dfc42ab2f4de1ad22140cbd8c\` ON \`user_favorites_bicicleta\``);
        await queryRunner.query(`DROP INDEX \`IDX_5cc7106a777c1d93f281324696\` ON \`user_favorites_bicicleta\``);
        await queryRunner.query(`DROP TABLE \`user_favorites_bicicleta\``);
        await queryRunner.query(`DROP TABLE \`bicicleta\``);
        await queryRunner.query(`DROP TABLE \`manutencao\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
