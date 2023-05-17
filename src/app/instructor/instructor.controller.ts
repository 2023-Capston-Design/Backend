import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  Param,
} from '@nestjs/common';
import { InstructorService } from './instructor.service';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { InstructorProfileRepsonse } from './dto/instructor-profile.response';
import { MEMBER_ERROR } from '@src/infrastructure/errors/members.errors';

@ApiTags('Instructor')
@Controller('instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) { }

  @Get()
  @ApiOperation({ summary: '모든 교수(혹은 지도자) 정보를 조회합니다' })
  @ApiOkResponse({ type: InstructorProfileRepsonse, isArray: true })
  public async getAllStudents(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pagesize', new DefaultValuePipe(10), ParseIntPipe) pagesize: number,
  ): Promise<InstructorProfileRepsonse[]> {
    return await this.instructorService.getAllInstructors(page, pagesize);
  }

  @Get(':id')
  @ApiOperation({ summary: '교수 정보를 ID로 조회합니다' })
  @ApiOkResponse({ type: InstructorProfileRepsonse })
  @ApiNotFoundResponse({
    description: MEMBER_ERROR.MEMBER_NOT_FOUND,
  })
  public async getStudentById(@Param('id', ParseIntPipe) id: number) {
    return await this.instructorService.getInstructorById(id);
  }
}
