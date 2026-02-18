import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticsModule } from './diagnostics/diagnostics.module.js';
import { SeedModule } from './seed/seed.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'fleet-diagnostics.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    DiagnosticsModule,
    SeedModule,
  ],
})
export class AppModule {}
