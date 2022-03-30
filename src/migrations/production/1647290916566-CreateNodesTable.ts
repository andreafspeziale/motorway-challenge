import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNodesTable1647290916566 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'nodes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'character varying',
          },
          {
            name: 'created_at',
            type: 'timestamp without time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp without time zone',
            isNullable: true,
            onUpdate: 'now()',
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('nodes');
  }
}
