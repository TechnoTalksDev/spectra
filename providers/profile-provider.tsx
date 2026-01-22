import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { ProfileContext, Profile, ProfileUpdateData } from '@/context/profile-context';
import { useSupabase } from '@/hooks/useSupabase';

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const { session, supabase, isLoaded } = useSupabase();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('[ProfileProvider] Fetching profile for user:', session.user.id);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (fetchError) {
        // If profile doesn't exist, that's okay - we'll create it during onboarding
        if (fetchError.code === 'PGRST116') {
          console.log('[ProfileProvider] Profile not found (will be created during onboarding)');
          setProfile(null);
        } else {
          throw fetchError;
        }
      } else {
        console.log('[ProfileProvider] Profile fetched:', data);
        setProfile(data);
      }
    } catch (err: any) {
      console.error('[ProfileProvider] Error fetching profile:', err);
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, supabase]);

  useEffect(() => {
    if (isLoaded) {
      fetchProfile();
    }
  }, [isLoaded, fetchProfile]);

  const createProfile = async (data: ProfileUpdateData): Promise<Profile | null> => {
    if (!session?.user?.id) {
      throw new Error('No active session');
    }

    try {
      setLoading(true);
      setError(null);

      console.log('[ProfileProvider] Creating profile:', data);

      // Validate first name length (minimum 3 characters as per schema)
      if (data.first_name && data.first_name.length < 3) {
        throw new Error('First name must be at least 3 characters');
      }

      const profileData = {
        id: session.user.id,
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        avatar_url: data.avatar_url || null,
        updated_at: new Date().toISOString(),
      };

      // Use upsert to handle cases where profile might already exist (e.g., from trigger)
      const { data: newProfile, error: upsertError } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' })
        .select()
        .single();

      if (upsertError) throw upsertError;

      console.log('[ProfileProvider] Profile created successfully:', newProfile);
      setProfile(newProfile);
      return newProfile;
    } catch (err: any) {
      console.error('[ProfileProvider] Error creating profile:', err);
      setError(err.message || 'Failed to create profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: ProfileUpdateData): Promise<Profile | null> => {
    if (!session?.user?.id) {
      throw new Error('No active session');
    }

    try {
      setLoading(true);
      setError(null);

      console.log('[ProfileProvider] Updating profile:', data);

      // Validate first name length if it's being updated
      if (data.first_name && data.first_name.length < 3) {
        throw new Error('First name must be at least 3 characters');
      }

      const profileData = {
        id: session.user.id,
        ...data,
        updated_at: new Date().toISOString(),
      };

      // Use upsert to handle cases where profile doesn't exist yet
      const { data: updatedProfile, error: upsertError } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' })
        .select()
        .single();

      if (upsertError) throw upsertError;

      console.log('[ProfileProvider] Profile updated successfully:', updatedProfile);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err: any) {
      console.error('[ProfileProvider] Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const hasProfile = profile !== null;

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        hasProfile,
        fetchProfile,
        createProfile,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
