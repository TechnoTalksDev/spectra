import { createContext } from 'react';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  hasProfile: boolean;
  fetchProfile: () => Promise<void>;
  createProfile: (data: ProfileUpdateData) => Promise<Profile | null>;
  updateProfile: (data: ProfileUpdateData) => Promise<Profile | null>;
}

export const ProfileContext = createContext<ProfileContextType | null>(null);
