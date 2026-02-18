import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';
import { SeedService } from './seed.service.js';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(SeedService);
  const count = await seeder.seed(500);
  console.log(`Seeded ${count} diagnostic events`);
  await app.close();
}

run();
