import {
  Body,
  Controller,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
  Post,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentCreateDto } from './dto/department-create.request';
import { DepartmentEntity } from './entities/department.entity';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DEPARTMENT_ERROR } from '@src/infrastructure/errors/department.error';

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
  @ApiOperation({
    summary: '부서정보를 생성합니다',
  })
  @ApiOkResponse({
    type: DepartmentEntity,
  })
  @ApiConflictResponse({
    description: DEPARTMENT_ERROR.DUPLICATED_DEPARMENT_NAME,
  })
  public async createDepartment(@Body() body: DepartmentCreateDto) {
    return await this.departmentService.createDepartment(body);
  }
}
