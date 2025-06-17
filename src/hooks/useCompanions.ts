
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Companion {
  id: string;
  name: string;
  age: number;
  experience: string;
  location: string;
  bio?: string;
  price: string;
  languages: string[];
  specialties: string[];
  rating: number;
  reviews: number;
  status: 'Active' | 'Inactive';
  join_date: string;
  created_at: string;
  updated_at: string;
}

export const useCompanions = () => {
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCompanions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanions((data || []) as Companion[]);
    } catch (error) {
      console.error('Error fetching companions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch companions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCompanion = async (companionData: Omit<Companion, 'id' | 'rating' | 'reviews' | 'status' | 'join_date' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('companions')
        .insert([companionData])
        .select()
        .single();

      if (error) throw error;

      setCompanions(prev => [data as Companion, ...prev]);
      toast({
        title: "Success",
        description: "Companion added successfully",
      });
      return data;
    } catch (error) {
      console.error('Error adding companion:', error);
      toast({
        title: "Error",
        description: "Failed to add companion",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCompanion = async (id: string, updates: Partial<Companion>) => {
    try {
      const { data, error } = await supabase
        .from('companions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCompanions(prev => prev.map(comp => comp.id === id ? data as Companion : comp));
      toast({
        title: "Success",
        description: "Companion updated successfully",
      });
      return data;
    } catch (error) {
      console.error('Error updating companion:', error);
      toast({
        title: "Error",
        description: "Failed to update companion",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCompanion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCompanions(prev => prev.filter(comp => comp.id !== id));
      toast({
        title: "Success",
        description: "Companion deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting companion:', error);
      toast({
        title: "Error",
        description: "Failed to delete companion",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCompanions();
  }, []);

  return {
    companions,
    loading,
    addCompanion,
    updateCompanion,
    deleteCompanion,
    refreshCompanions: fetchCompanions
  };
};
