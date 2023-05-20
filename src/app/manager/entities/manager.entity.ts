import { Member } from '@src/infrastructure/abstract-entities/member.abstract';
import { MemberInterface } from '@src/infrastructure/abstract-entities/member.interface';
import { Entity } from 'typeorm';

@Entity('manager')
export class ManagerEntity extends Member implements MemberInterface {}
