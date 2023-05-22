import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ModifyRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  changedpassword?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;
}
