export interface UserData {
    name: string;
    email: string;
    password: string;
    role: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }