import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { HttpExceptionsFilter } from '../../common/exceptions';
import config, { envSchema, Config, DbConfig } from '../../config';
import { LoggerModule } from '../../logger/logger.module';
import { UsersModule } from '../../users/users.module';
import { DevicesModule } from '../../devices/devices.module';
import { NodesModule } from '../../nodes/nodes.module';
import { EdgesModule } from '../../edges/edges.module';
import { Node } from '../../nodes/entities';
import { User } from '../../users/entities';
import { Device } from '../../devices/entities';
import { EventsModule } from '../events.module';
import { Event } from '../entities';
import { EventType } from '../events.interfaces';
import { EventExceptionCode } from '../exceptions';

describe('Events.e2e', () => {
  let app: INestApplication;
  let nodeRepository: Repository<Node>;
  let userRepository: Repository<User>;
  let deviceRepository: Repository<Device>;
  let eventRepository: Repository<Event>;

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
        NodesModule,
        EdgesModule,
        EventsModule,
      ],
      providers: [
        {
          provide: APP_PIPE,
          useFactory: (): ValidationPipe =>
            new ValidationPipe({
              transform: true,
              whitelist: true,
              forbidNonWhitelisted: true,
            }),
        },
        {
          provide: APP_FILTER,
          useClass: HttpExceptionsFilter,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    nodeRepository = app.get('NodeRepository');
    userRepository = app.get('UserRepository');
    deviceRepository = app.get('DeviceRepository');
    eventRepository = app.get('EventRepository');

    await app.init();
  });

  describe('POST /events', () => {
    it('Should not create an Event with inexistent Device', async () => {
      const response = await request(app.getHttpServer())
        .post('/events')
        .send({
          type: EventType.Entrance,
          device: { id: '02190cc9-542f-44f8-8758-7c05564dbcc9' },
          node: { id: '02190cc9-542f-44f8-8758-7c05564dbcc9' },
        })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.code).toBe(EventExceptionCode.ConstraintsViolation);
    });

    it('Should not create an Event with inexistent Node', async () => {
      const insertedUser = await userRepository.save({});
      const { id } = await deviceRepository.save({ user: insertedUser });

      const response = await request(app.getHttpServer())
        .post('/events')
        .send({
          type: EventType.Entrance,
          device: { id },
          node: { id: '02190cc9-542f-44f8-8758-7c05564dbcc9' },
        })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.code).toBe(EventExceptionCode.ConstraintsViolation);
    });

    it('Should not create an entrance Event if never exited', async () => {
      const { id: insertedNodeId } = await nodeRepository.save({ name: 'A' });
      const insertedUser = await userRepository.save({});
      const { id: insertedDeviceId } = await deviceRepository.save({ user: insertedUser });

      await eventRepository.save({
        type: EventType.Entrance,
        device: { id: insertedDeviceId },
        node: { id: insertedNodeId },
      });

      const response = await request(app.getHttpServer())
        .post('/events')
        .send({
          type: EventType.Entrance,
          device: { id: insertedDeviceId },
          node: { id: insertedNodeId },
        })
        .expect(HttpStatus.CONFLICT);

      expect(response.body.code).toBe(EventExceptionCode.WrongTypeException);
    });

    it('Should not create an exit Event if never entered', async () => {
      const { id: insertedNodeId } = await nodeRepository.save({ name: 'A' });
      const insertedUser = await userRepository.save({});
      const { id: insertedDeviceId } = await deviceRepository.save({ user: insertedUser });

      await eventRepository.save({
        type: EventType.Entrance,
        device: { id: insertedDeviceId },
        node: { id: insertedNodeId },
      });

      await eventRepository.save({
        type: EventType.Exit,
        device: { id: insertedDeviceId },
        node: { id: insertedNodeId },
      });

      const response = await request(app.getHttpServer())
        .post('/events')
        .send({
          type: EventType.Exit,
          device: { id: insertedDeviceId },
          node: { id: insertedNodeId },
        })
        .expect(HttpStatus.CONFLICT);

      expect(response.body.code).toBe(EventExceptionCode.WrongTypeException);
    });

    it('Should not create an exit Event if exiting the same Node', async () => {
      const { id: insertedNodeId } = await nodeRepository.save({ name: 'A' });
      const insertedUser = await userRepository.save({});
      const { id: insertedDeviceId } = await deviceRepository.save({ user: insertedUser });

      await eventRepository.save({
        type: EventType.Entrance,
        device: { id: insertedDeviceId },
        node: { id: insertedNodeId },
      });

      const response = await request(app.getHttpServer())
        .post('/events')
        .send({
          type: EventType.Exit,
          device: { id: insertedDeviceId },
          node: { id: insertedNodeId },
        })
        .expect(HttpStatus.CONFLICT);

      expect(response.body.code).toBe(EventExceptionCode.EntranceExitException);
    });

    it('Should create an Event', async () => {
      const { id: insertedNodeId } = await nodeRepository.save({ name: 'A' });
      const insertedUser = await userRepository.save({});
      const { id: insertedDeviceId } = await deviceRepository.save({ user: insertedUser });

      const response = await request(app.getHttpServer())
        .post('/events')
        .send({
          type: EventType.Entrance,
          device: { id: insertedDeviceId },
          node: { id: insertedNodeId },
        })
        .expect(201);

      const [insertedEvent] = await eventRepository.find();

      expect(response.body.id).toEqual(insertedEvent.id);
    });
  });

  afterEach(async () => {
    await eventRepository.query(`DELETE FROM events;`);
    await deviceRepository.query(`DELETE FROM devices;`);
    await userRepository.query(`DELETE FROM users;`);
    await nodeRepository.query(`DELETE FROM nodes;`);
  });

  afterAll(async () => {
    await app.close();
  });
});
