import { Role } from '@infrastructure/enum/role.enum';
import { Sex } from '@infrastructure/enum/sex.enum';

export interface MemberInterface {
  email: string;
  name: string;
  password: string;
  sex: Sex;
  role: Role;
  birth?: Date;
  profileImageURL?: string;
}
