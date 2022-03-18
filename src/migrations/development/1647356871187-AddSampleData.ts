import { MigrationInterface, QueryRunner } from 'typeorm';
import { Device } from '../../devices/entities';
import { User } from '../../users/entities';
import { Node } from '../../nodes/entities';
import { Edge } from '../../edges/entities';

export class AddSampleData1647356871187 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const deviceId = 'e3ab8c16-78ef-47db-8e4f-d0173126ffe0'; // useful as default value in Postman
    const CityANodeId = '6cacc7e2-7f71-4240-a4d0-dddb189338df'; // useful as default value in Postman
    const CityBNodeId = '76310119-0623-41e8-bb88-4a4e1597ce03';
    const CityCNodeId = '1f8642d8-7252-431d-b209-87ff535c692a';
    const CityDNodeId = 'd43d0c98-9f68-4809-be85-2c36f7517aa3';

    const user = await queryRunner.manager.save(queryRunner.manager.create<User>(User, {}));
    await queryRunner.manager.save(
      queryRunner.manager.create<Device>(Device, {
        id: deviceId,
        user,
      })
    );

    await Promise.all([
      queryRunner.manager.save(
        queryRunner.manager.create<Node>(Node, {
          id: CityANodeId,
          name: 'CityA',
        })
      ),
      queryRunner.manager.save(
        queryRunner.manager.create<Node>(Node, {
          id: CityBNodeId,
          name: 'CityB',
        })
      ),
      queryRunner.manager.save(
        queryRunner.manager.create<Node>(Node, {
          id: CityCNodeId,
          name: 'CityC',
        })
      ),
      queryRunner.manager.save(
        queryRunner.manager.create<Node>(Node, {
          id: CityDNodeId,
          name: 'CityD',
        })
      ),
    ]);

    await Promise.all([
      queryRunner.manager.save(
        queryRunner.manager.create<Edge>(Edge, {
          from: CityANodeId,
          to: CityCNodeId,
          weight: 2,
        })
      ),
      queryRunner.manager.save(
        queryRunner.manager.create<Edge>(Edge, {
          from: CityBNodeId,
          to: CityCNodeId,
          weight: 6,
        })
      ),
      queryRunner.manager.save(
        queryRunner.manager.create<Edge>(Edge, {
          from: CityCNodeId,
          to: CityDNodeId,
          weight: 12,
        })
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.query('DELETE * FROM devices');
    await queryRunner.manager.query('DELETE * FROM users');
    await queryRunner.manager.query('DELETE * FROM edges');
    await queryRunner.manager.query('DELETE * FROM nodes');
  }
}
