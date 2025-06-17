
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Hotel {
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
  star_rating: number | null;
  amenities: string[] | null;
  room_types: string[] | null;
  price_range: string | null;
  rating: number | null;
  total_reviews: number | null;
  rooms_available: number | null;
  total_rooms: number | null;
  image_url: string | null;
  description: string | null;
}

export const useHotels = (searchParams: {
  city?: string;
  state?: string;
  priceRange?: string;
  searchTerm?: string;
}) => {
  return useQuery({
    queryKey: ['hotels', searchParams],
    queryFn: async () => {
      console.log('Fetching hotels with params:', searchParams);
      let query = supabase.from('hotels').select('*');

      // Apply filters only if they have actual values
      if (searchParams.city && searchParams.city.trim() !== '') {
        query = query.ilike('city', `%${searchParams.city}%`);
      }

      if (searchParams.state && searchParams.state.trim() !== '') {
        query = query.ilike('state', `%${searchParams.state}%`);
      }

      if (searchParams.searchTerm && searchParams.searchTerm.trim() !== '') {
        query = query.or(`name.ilike.%${searchParams.searchTerm}%,address.ilike.%${searchParams.searchTerm}%,description.ilike.%${searchParams.searchTerm}%`);
      }

      const { data, error } = await query.order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching hotels:', error);
        throw error;
      }

      console.log('Fetched hotels:', data?.length || 0);
      return data as Hotel[];
    },
    enabled: true,
  });
};
