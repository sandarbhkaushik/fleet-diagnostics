import { Controller, Get, Post, Param, ParseIntPipe, Query, Body } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiagnosticsService } from '../services/diagnostics.service.js';
import { QueryEventsDto } from '../dto/query-events.dto.js';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly diagnosticsService: DiagnosticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get filtered, paginated diagnostic events' })
  findAll(@Query() query: QueryEventsDto) {
    return this.diagnosticsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single diagnostic event by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.diagnosticsService.findOne(id);
  }

  @Post('ingest')
  @ApiOperation({ summary: 'Ingest diagnostic log lines (plain text, one event per line)' })
  @ApiConsumes('text/plain')
  @ApiBody({ description: 'Raw log lines', schema: { type: 'string' } })
  ingest(@Body() body: string) {
    return this.diagnosticsService.ingest(body);
  }
}
