type FieldOptional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

interface SwaggerTag {
  tag: string;
  description: string;
}
