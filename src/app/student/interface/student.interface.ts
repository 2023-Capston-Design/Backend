import { MemberInterface } from '@infrastructure/abstract-entities/member.interface';

export interface StudentInterface extends MemberInterface {
  studentId: string;
}
