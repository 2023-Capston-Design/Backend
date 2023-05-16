import { MemberInterface } from '@infrastructure/abstract-entities/member.interface';
import { Column } from 'typeorm';

export interface InstructorInterface extends MemberInterface {
  laboratory?: string;
}
