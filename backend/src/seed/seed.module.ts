import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticEvent } from '../diagnostics/entities/diagnostic-event.entity.js';
import { SeedService } from './seed.service.js';
import { LogParserService } from '../diagnostics/parser/log-parser.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnosticEvent])],
  providers: [SeedService, LogParserService],
  exports: [SeedService],
})
export class SeedModule {}
