import {
  Controller,
  Param,
  Get,
  ParseUUIDPipe,
  Post,
  Body,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  NotFoundException,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentProfileResponse } from './dto/student-profile.response';
import { StudentCreateDto } from './dto/student-create.request';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MEMBER_ERROR } from '@infrastructure/errors/members.errors';
import { StudentEntity } from './entities/student.entity';

@ApiTags('Student')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @Get()
  @ApiOperation({ summary: '모든 학생 정보를 조회합니다' })
  @ApiOkResponse({ type: StudentProfileResponse, isArray: true })
  public async getAllStudents(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pagesize', new DefaultValuePipe(10), ParseIntPipe) pagesize: number,
  ): Promise<StudentProfileResponse[]> {
    return await this.studentService.getAllStudents(page, pagesize);
  }

  @Get(':id')
  @ApiOperation({ summary: '학생 정보를 ID로 조회합니다' })
  @ApiOkResponse({ type: StudentProfileResponse })
  @ApiNotFoundResponse({
    description: MEMBER_ERROR.MEMBER_NOT_FOUND,
  })
  public async getStudentById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StudentProfileResponse> {
    return await this.studentService.getStudentInformationById(id);
  }
}
