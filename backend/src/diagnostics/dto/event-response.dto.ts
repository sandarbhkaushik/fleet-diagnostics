import { ApiProperty } from '@nestjs/swagger';

export class EventResponseDto {
  @ApiProperty() id!: number;
  @ApiProperty() timestamp!: Date;
  @ApiProperty() vehicleId!: string;
  @ApiProperty() level!: string;
  @ApiProperty() code!: string;
  @ApiProperty() message!: string;
  @ApiProperty() rawLine!: string;
}

export class PaginatedEventsDto {
  @ApiProperty({ type: [EventResponseDto] }) data!: EventResponseDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
  @ApiProperty() totalPages!: number;
}

export class SummaryDto {
  @ApiProperty() totalEvents!: number;
  @ApiProperty() errorCount!: number;
  @ApiProperty() warnCount!: number;
  @ApiProperty() infoCount!: number;
  @ApiProperty() criticalVehicleCount!: number;
}

export class ErrorsPerVehicleDto {
  @ApiProperty() vehicleId!: string;
  @ApiProperty() errorCount!: number;
}

export class TopCodeDto {
  @ApiProperty() code!: string;
  @ApiProperty() count!: number;
}

export class CriticalVehicleDto {
  @ApiProperty() vehicleId!: string;
  @ApiProperty() recentErrorCount!: number;
}
