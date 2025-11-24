import { useState, useEffect } from 'react';
import { useSupabase } from './useSupabase';
import { VisionAnalysis } from '@/services/gemini-vision';

export interface VisionHistoryItem {
  id: string;
  user_id: string;
  image_uri?: string;
  mode: 'quick' | 'detailed' | 'accessibility' | 'continuous';
  description: string;
  objects: string[];
  scene?: string;
  accessibility_info?: string;
  created_at: string;
}

export function useVisionHistory() {
  const { supabase, session } = useSupabase();
  const [history, setHistory] = useState<VisionHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = session?.user;

  // Fetch history
  const fetchHistory = async (limit: number = 50) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching vision history for user:', user.id);

      const { data, error: fetchError } = await supabase
        .from('vision_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fetchError) {
        console.error('Fetch error details:', fetchError);
        throw fetchError;
      }

      console.log(`Successfully fetched ${data?.length || 0} history items`);
      setHistory(data || []);
    } catch (err) {
      console.error('Error fetching vision history:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  // Save analysis to history
  const saveToHistory = async (
    analysis: VisionAnalysis,
    mode: 'quick' | 'detailed' | 'accessibility' | 'continuous',
    imageUri?: string
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      console.log('Saving to history:', { mode, imageUri, userId: user.id });
      
      const { data, error: insertError } = await supabase
        .from('vision_history')
        .insert({
          user_id: user.id,
          image_uri: imageUri,
          mode,
          description: analysis.description,
          objects: analysis.objects,
          scene: analysis.scene,
          accessibility_info: analysis.accessibility,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error details:', insertError);
        throw insertError;
      }

      console.log('Successfully saved to history:', data);

      // Add to local state
      setHistory(prev => [data, ...prev]);

      return data;
    } catch (err) {
      console.error('Error saving to history:', err);
      throw err;
    }
  };

  // Delete history item
  const deleteHistoryItem = async (id: string) => {
    if (!user) return;

    try {
      const { error: deleteError } = await supabase
        .from('vision_history')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Remove from local state
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting history item:', err);
      throw err;
    }
  };

  // Clear all history
  const clearHistory = async () => {
    if (!user) return;

    try {
      const { error: deleteError } = await supabase
        .from('vision_history')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setHistory([]);
    } catch (err) {
      console.error('Error clearing history:', err);
      throw err;
    }
  };

  // Get statistics
  const getStatistics = () => {
    if (!history.length) {
      return {
        total: 0,
        byMode: { quick: 0, detailed: 0, accessibility: 0, continuous: 0 },
        uniqueObjects: 0,
        recentActivity: [],
      };
    }

    const byMode = history.reduce((acc, item) => {
      acc[item.mode] = (acc[item.mode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const allObjects = history.flatMap(item => item.objects);
    const uniqueObjects = new Set(allObjects).size;

    const recentActivity = history.slice(0, 5);

    return {
      total: history.length,
      byMode,
      uniqueObjects,
      recentActivity,
    };
  };

  // Load history on mount
  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  return {
    history,
    loading,
    error,
    fetchHistory,
    saveToHistory,
    deleteHistoryItem,
    clearHistory,
    getStatistics,
  };
}
