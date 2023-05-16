enum Role {
  PROFESSOR = 'professor',
  STUDENT = 'student',
}

enum Sex {
  MALE = 'male',
  FEMALE = 'female',
}

type FieldOptional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
