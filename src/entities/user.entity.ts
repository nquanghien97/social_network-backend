export default interface UserEntity {
  id: number;
  email: string;
  password: string;
  fullName?: string | null;
  location?: string | null;  
  avatar?: string | null;     
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}