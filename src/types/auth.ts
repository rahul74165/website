export interface UserProfile {
  id: string;
  name?: string;
  email: string;
  photoURL?: string;
  createdAt: any;
  updatedAt: any;
}

export interface AuthError {
  code: string;
  message: string;
}