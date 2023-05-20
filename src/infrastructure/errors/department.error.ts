import { BadRequestException, ConflictException } from '@nestjs/common';

export enum DEPARTMENT_ERROR {
  DEPARTMENT_NOT_FOUND = 'DEPARTMENT_NOT_FOUND',
  DUPLICATED_DEPARMENT_NAME = 'DUPLICATED_DEPARMENT_NAME',
}

export class DepartmentNotFound extends BadRequestException {
  constructor() {
    super('부서를 찾을 수 없습니다', DEPARTMENT_ERROR.DEPARTMENT_NOT_FOUND);
  }
}

export class DuplicatedDepartmentName extends ConflictException {
  constructor() {
    super(
      '이미 등록된 부서 이름입니다',
      DEPARTMENT_ERROR.DUPLICATED_DEPARMENT_NAME,
    );
  }
}
