export interface MemberInterface {
  id: string;
  email: string;
  name: string;
  password: string;
  sex: Sex;
  role: Role;
  birth?: Date;
  profileImageURL?: string;
}
