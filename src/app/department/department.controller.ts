import {
  Body,
  Controller,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
  Post,
  UseGuards,
  Delete,
  Patch,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentCreateDto } from './dto/department-create.request';
import { DepartmentEntity } from './entities/department.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DEPARTMENT_ERROR } from '@src/infrastructure/errors/department.error';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from '@src/infrastructure/enum/role.enum';
import { AllowedRole } from '@src/infrastructure/rbac/decorator/role.decorator';
import { RoleGuard } from '@src/infrastructure/rbac/role/role.guard';
import { DepartmentDeleteRequest } from './dto/department-delete.request';
import { DepartmentModifyDto } from './dto/department-modify.request';

@ApiTags('Department')
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Get()
  @ApiOperation({
    summary:
      '부서 정보를 모두 가져옵니다. Pagination - page : Page Number, pagesize : 한페이지에 로드할 게시물 개수',
  })
  @ApiOkResponse({
    type: DepartmentEntity,
    isArray: true,
  })
  public async getDepartments(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pagesize', new DefaultValuePipe(10), ParseIntPipe) pagesize: number,
  ): Promise<DepartmentEntity[]> {
    return await this.departmentService.getAllDepartment(page, pagesize);
  }

  @Get(':id')
  @ApiOperation({
    summary: '부서 정보를 ID를 통해 가져옵니다',
  })
  @ApiOkResponse({
    type: DepartmentEntity,
  })
  @ApiBadRequestResponse({
    description: DEPARTMENT_ERROR.DEPARTMENT_NOT_FOUND,
  })
  public async getDepartmentsById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DepartmentEntity> {
    return await this.departmentService.getDepartmentById(id);
  }

  @Post()
  @AllowedRole([Role.MANAGER])
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '부서정보를 생성합니다. Manager 권한이 요구됩니다.',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: DepartmentEntity,
  })
  @ApiConflictResponse({
    description: DEPARTMENT_ERROR.DUPLICATED_DEPARMENT_NAME,
  })
  public async createDepartment(@Body() body: DepartmentCreateDto) {
    return await this.departmentService.createDepartment(body);
  }

  @Patch('modify')
  @AllowedRole([Role.MANAGER])
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '부서정보를 수정합니다. Manager 권한이 요구됩니다.',
  })
  @ApiBadRequestResponse({
    description: DEPARTMENT_ERROR.DEPARTMENT_NOT_FOUND,
  })
  public async modifyDepartment(
    @Body() body: DepartmentModifyDto,
  ): Promise<boolean> {
    return await this.departmentService.modifyDepartment(body);
  }

  @Delete('withdraw')
  @AllowedRole([Role.MANAGER])
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '부서정보를 삭제합니다. Manager 권한이 요구됩니다.',
  })
  @ApiBadRequestResponse({
    description: DEPARTMENT_ERROR.DEPARTMENT_NOT_FOUND,
  })
  @ApiConflictResponse({
    description: DEPARTMENT_ERROR.MEMEBER_STILL_BELONGS_TO_DEPARTMENT,
  })
  public async withdrawDepartment(
    @Body() body: DepartmentDeleteRequest,
  ): Promise<boolean> {
    return await this.departmentService.withdrawDepartment(body);
  }
}
