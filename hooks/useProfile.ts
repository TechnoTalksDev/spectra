import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from './useSupabase';

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

export const useProfile = () => {
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

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (fetchError) {
        // If profile doesn't exist, that's okay - we'll create it during onboarding
        if (fetchError.code === 'PGRST116') {
          setProfile(null);
        } else {
          throw fetchError;
        }
      } else {
        setProfile(data);
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
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

      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (insertError) throw insertError;

      setProfile(newProfile);
      return newProfile;
    } catch (err: any) {
      console.error('Error creating profile:', err);
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

      // Validate first name length if it's being updated
      if (data.first_name && data.first_name.length < 3) {
        throw new Error('First name must be at least 3 characters');
      }

      const updateData = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', session.user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const hasProfile = profile !== null;

  return {
    profile,
    loading,
    error,
    hasProfile,
    fetchProfile,
    createProfile,
    updateProfile,
  };
};
