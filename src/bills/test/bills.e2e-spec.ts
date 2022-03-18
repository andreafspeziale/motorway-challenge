import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import config, { envSchema, Config, DbConfig } from '../../config';
import { LoggerModule } from '../../logger/logger.module';
import { UsersModule } from '../../users/users.module';
import { DevicesModule } from '../../devices/devices.module';
import { Node } from '../../nodes/entities';
import { Edge } from '../../edges/entities';
import { User } from '../../users/entities';
import { Device } from '../../devices/entities';
import { Event } from '../../events/entities';
import { BillsModule } from '../bills.module';
import { BillsService } from '../bills.service';
import { BillIncompletedTravels } from '../exceptions';

describe('Bills.e2e', () => {
  let app: INestApplication;
  let nodeRepository: Repository<Node>;
  let edgeRepository: Repository<Edge>;
  let userRepository: Repository<User>;
  let deviceRepository: Repository<Device>;
  let eventRepository: Repository<Event>;
  let billsService: BillsService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/.env.test',
          load: [config],
          validationSchema: envSchema,
        }),
        LoggerModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService<Config>) => {
            const { migrationsFolder, ...rest } = configService.get<DbConfig>('db');

            return {
              entities: ['src/**/*.entity{.ts,.js}'],
              migrations: [`src/**/migrations/${migrationsFolder}/*{.ts,.js}`],
              ...rest,
            };
          },
          inject: [ConfigService],
        }),
        UsersModule,
        DevicesModule,
        BillsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    nodeRepository = app.get('NodeRepository');
    edgeRepository = app.get('EdgeRepository');
    userRepository = app.get('UserRepository');
    deviceRepository = app.get('DeviceRepository');
    eventRepository = app.get('EventRepository');

    billsService = app.get(BillsService);

    await app.init();
  });

  describe('computeBill', () => {
    it('Should throw BillIncompletedTravels', async () => {
      const costKm = 5;

      const nodeA = await nodeRepository.save({ name: 'CityA' });

      const user = await userRepository.save({});
      const device = await deviceRepository.save({ user });

      await eventRepository.save([
        {
          type: 'entrance',
          device,
          node: nodeA,
          createdAt: new Date('2022-03-13T00:00:00'),
        },
      ]);

      await expect(
        billsService.computeBill({
          user,
          period: { from: new Date('2022-03-13T00:00:00'), to: new Date('2022-03-14T00:00:00') },
          costKm,
        })
      ).rejects.toThrow(BillIncompletedTravels);
    });
    it('Should correctly compute a Bill', async () => {
      const costKm = 5;

      const [nodeA, nodeB, nodeC, nodeD] = await nodeRepository.save([
        { name: 'CityA' },
        { name: 'CityB' },
        { name: 'CityC' },
        { name: 'CityD' },
      ]);

      const [shortestPath] = await edgeRepository.save([
        { from: nodeA.id, to: nodeD.id, weight: 10 },
        { from: nodeA.id, to: nodeC.id, weight: 2 },
        { from: nodeB.id, to: nodeC.id, weight: 6 },
        { from: nodeC.id, to: nodeD.id, weight: 12 },
      ]);

      const user = await userRepository.save({});
      const device = await deviceRepository.save({ user });

      await eventRepository.save([
        {
          type: 'entrance',
          device,
          node: nodeA,
          createdAt: new Date('2022-03-13T00:00:00'),
        },
        {
          type: 'exit',
          device,
          node: nodeD,
          createdAt: new Date('2022-03-13T07:00:00'),
        },
        {
          type: 'entrance',
          device,
          node: nodeD,
          createdAt: new Date('2022-03-15T01:00:00'),
        },
        {
          type: 'exit',
          device,
          node: nodeA,
          createdAt: new Date('2022-03-15T02:00:00'),
        },
      ]);

      const computedBill = await billsService.computeBill({
        user,
        period: { from: new Date('2022-03-15T00:00:00'), to: new Date('2022-03-16T00:00:00') },
        costKm,
      });

      expect(computedBill).toEqual(costKm * shortestPath.weight);
    });
  });

  afterEach(async () => {
    await eventRepository.query(`DELETE FROM events;`);
    await edgeRepository.query(`DELETE FROM edges;`);
    await nodeRepository.query(`DELETE FROM nodes;`);
    await deviceRepository.query(`DELETE FROM devices;`);
    await userRepository.query(`DELETE FROM users;`);
  });

  afterAll(async () => {
    await app.close();
  });
});
