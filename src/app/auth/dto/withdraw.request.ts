import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class WithdrawRequest {
  @ApiProperty({ description: '계정 비밀번호' })
  @IsNotEmpty()
  @IsString()
  password: string;

  constructor(data: WithdrawRequest) {
    Object.assign(this, data);
  }
}
