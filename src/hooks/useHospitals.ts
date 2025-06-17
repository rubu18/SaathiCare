
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  specialties: string[] | null;
  facilities: string[] | null;
  rating: number | null;
  total_reviews: number | null;
  emergency_services: boolean | null;
  beds_available: number | null;
  total_beds: number | null;
  image_url: string | null;
  description: string | null;
}

export const useHospitals = (searchParams: {
  city?: string;
  state?: string;
  specialty?: string;
  searchTerm?: string;
}) => {
  return useQuery({
    queryKey: ['hospitals', searchParams],
    queryFn: async () => {
      console.log('Fetching hospitals with params:', searchParams);
      let query = supabase.from('hospitals').select('*');

      // Apply filters only if they have actual values
      if (searchParams.city && searchParams.city.trim() !== '') {
        query = query.ilike('city', `%${searchParams.city}%`);
      }

      if (searchParams.state && searchParams.state.trim() !== '') {
        query = query.ilike('state', `%${searchParams.state}%`);
      }

      if (searchParams.specialty && searchParams.specialty.trim() !== '') {
        query = query.contains('specialties', [searchParams.specialty]);
      }

      if (searchParams.searchTerm && searchParams.searchTerm.trim() !== '') {
        query = query.or(`name.ilike.%${searchParams.searchTerm}%,address.ilike.%${searchParams.searchTerm}%,description.ilike.%${searchParams.searchTerm}%`);
      }

      const { data, error } = await query.order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching hospitals:', error);
        throw error;
      }

      console.log('Fetched hospitals:', data?.length || 0);
      return data as Hospital[];
    },
    enabled: true,
  });
};
