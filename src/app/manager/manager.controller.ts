import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ManagerProfileResponse } from './dto/manager-profile.response';
import { MEMBER_ERROR } from '@src/infrastructure/errors/members.errors';

@ApiTags('Manager')
@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) { }

  @Get()
  @ApiOperation({ summary: '모든 관리자 정보를 조회합니다' })
  @ApiOkResponse({ type: ManagerProfileResponse, isArray: true })
  public async getAllManagers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pagesize', new DefaultValuePipe(10), ParseIntPipe) pagesize: number,
  ): Promise<ManagerProfileResponse[]> {
    return this.managerService.getAllManager(page, pagesize);
  }

  @Get(':id')
  @ApiOperation({ summary: '관리자 정보를 관리자 정보로 조회합니다' })
  @ApiOkResponse({ type: ManagerProfileResponse })
  @ApiNotFoundResponse({
    description: MEMBER_ERROR.MEMBER_NOT_FOUND,
  })
  public async getManagerById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ManagerProfileResponse> {
    return await this.managerService.getManagerById(id);
  }
}
