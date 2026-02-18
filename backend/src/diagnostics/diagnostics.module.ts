import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticEvent } from './entities/diagnostic-event.entity.js';
import { LogParserService } from './parser/log-parser.service.js';
import { DiagnosticsService } from './services/diagnostics.service.js';
import { AggregationService } from './services/aggregation.service.js';
import { EventsController } from './controllers/events.controller.js';
import { AggregationController } from './controllers/aggregation.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnosticEvent])],
  controllers: [EventsController, AggregationController],
  providers: [LogParserService, DiagnosticsService, AggregationService],
  exports: [LogParserService, DiagnosticsService],
})
export class DiagnosticsModule {}
