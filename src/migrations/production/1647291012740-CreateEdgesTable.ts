import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateEdgesTable1647291012740 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'edges',
        columns: [
          {
            name: 'from',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'to',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'weight',
            type: 'decimal',
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

    await queryRunner.createForeignKeys('edges', [
      new TableForeignKey({
        columnNames: ['from'],
        referencedTableName: 'nodes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);

    await queryRunner.createForeignKeys('edges', [
      new TableForeignKey({
        columnNames: ['to'],
        referencedTableName: 'nodes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('edges');
  }
}
