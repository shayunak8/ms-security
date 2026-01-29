import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Game API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('POST /session -> POST /roll -> POST /cashout closes session', async () => {
    const server = app.getHttpServer();

    const sessionRes = await request(server).post('/session').send({}).expect(201);
    expect(typeof sessionRes.body.sessionId).toBe('string');
    expect(sessionRes.body.credits).toBe(10);

    const rollRes = await request(server)
      .post('/roll')
      .send({ sessionId: sessionRes.body.sessionId })
      .expect(200);

    expect(Array.isArray(rollRes.body.symbols)).toBe(true);
    expect(rollRes.body.symbols).toHaveLength(3);
    expect(typeof rollRes.body.winAmount).toBe('number');
    expect(typeof rollRes.body.credits).toBe('number');

    const cashoutRes = await request(server)
      .post('/cashout')
      .send({ sessionId: sessionRes.body.sessionId })
      .expect(200);
    expect(cashoutRes.body.status).toBe('closed');
    expect(typeof cashoutRes.body.finalCredits).toBe('number');

    await request(server)
      .post('/roll')
      .send({ sessionId: sessionRes.body.sessionId })
      .expect(400);
  });

  it('POST /roll validates sessionId as UUID', async () => {
    const server = app.getHttpServer();
    await request(server)
      .post('/roll')
      .send({ sessionId: 'not-a-uuid' })
      .expect(400);
  });
});
