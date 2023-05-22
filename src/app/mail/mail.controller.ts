import { Controller, Get, Param, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  @Get('validate/:verifyToken')
  public async validateMail(@Param('verifyToken') token: string) {
    await this.mailService.validateMail(token);
    return {
      result: 'ok',
    };
  }

  @Get('validate-request')
  @ApiOperation({
    description: '이메일 인증을 진행합니다. 최대 1시간 이후 토큰이 삭제됩니다.',
  })
  public async validateMailRequest(@Query('to') to: string) {
    await this.mailService.validateMailRequest(to);
    return {
      result: 'ok',
    };
  }
}
