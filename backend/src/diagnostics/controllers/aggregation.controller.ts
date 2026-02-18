import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { AggregationService } from '../services/aggregation.service.js';

class TimeRangeQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsDateString() from?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() to?: string;
}

@ApiTags('Aggregations')
@Controller('aggregations')
export class AggregationController {
  constructor(private readonly aggregationService: AggregationService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get overall fleet summary counts (optional time range)' })
  getSummary(@Query() range: TimeRangeQueryDto) {
    return this.aggregationService.getSummary(range);
  }

  @Get('errors-per-vehicle')
  @ApiOperation({ summary: 'Get error counts grouped by vehicle (optional time range)' })
  getErrorsPerVehicle(@Query() range: TimeRangeQueryDto) {
    return this.aggregationService.getErrorsPerVehicle(range);
  }

  @Get('top-codes')
  @ApiOperation({ summary: 'Get most frequent diagnostic codes (optional time range)' })
  getTopCodes(@Query('limit') limit?: number, @Query() range?: TimeRangeQueryDto) {
    return this.aggregationService.getTopCodes(limit ? Number(limit) : 10, range);
  }

  @Get('critical-vehicles')
  @ApiOperation({ summary: 'Get vehicles with 3+ errors in last 24h' })
  getCriticalVehicles() {
    return this.aggregationService.getCriticalVehicles();
  }
}
