export default interface UserEntity {
  id: string;
  email: string;
  password: string;
  fullName?: string | null;
  location?: string | null;
  avatar?: string | null;
  description?: string | null;
  job?: string | null;
  createdAt: Date;
  updatedAt: Date;
}