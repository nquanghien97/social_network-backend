export interface createUserDTO {
  email: string;
  password: string;
}

export interface updateUserDTO {
  fullName?: string;
  location?: string;
  description?: string;
  job?: string;
}