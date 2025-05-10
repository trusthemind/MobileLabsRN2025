import { User } from "firebase/auth";

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  weight?: number;
  height?: number;
  city?: string;
  bloodType?: string;
  birthday?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  login: (user: User) => Promise<void>;
  getStoredUser: () => Promise<User | null>;
  fetchUserDetails: (uid: string) => Promise<any>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export interface UserDetails {
  birthday: string;
  bloodType: string;
  city: string;
  height: number;
  weight: number;
}
