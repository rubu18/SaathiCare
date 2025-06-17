
-- Create hospitals table with location and specialty data
CREATE TABLE public.hospitals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  website TEXT,
  specialties TEXT[] DEFAULT '{}',
  facilities TEXT[] DEFAULT '{}',
  rating DECIMAL(3, 2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  emergency_services BOOLEAN DEFAULT false,
  beds_available INTEGER DEFAULT 0,
  total_beds INTEGER DEFAULT 0,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hotels table with location data
CREATE TABLE public.hotels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  website TEXT,
  star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5),
  amenities TEXT[] DEFAULT '{}',
  room_types TEXT[] DEFAULT '{}',
  price_range TEXT, -- e.g., "₹2000-₹5000"
  rating DECIMAL(3, 2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  rooms_available INTEGER DEFAULT 0,
  total_rooms INTEGER DEFAULT 0,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better search performance
CREATE INDEX idx_hospitals_city_state ON public.hospitals(city, state);
CREATE INDEX idx_hospitals_specialties ON public.hospitals USING GIN(specialties);
CREATE INDEX idx_hospitals_location ON public.hospitals(latitude, longitude);
CREATE INDEX idx_hotels_city_state ON public.hotels(city, state);
CREATE INDEX idx_hotels_amenities ON public.hotels USING GIN(amenities);
CREATE INDEX idx_hotels_location ON public.hotels(latitude, longitude);

-- Add triggers for updated_at
CREATE TRIGGER update_hospitals_updated_at
  BEFORE UPDATE ON public.hospitals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hotels_updated_at
  BEFORE UPDATE ON public.hotels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample hospital data for major Indian cities
INSERT INTO public.hospitals (name, address, city, state, pincode, latitude, longitude, phone, specialties, facilities, rating, total_reviews, emergency_services, beds_available, total_beds, description) VALUES
('AIIMS Delhi', 'Ansari Nagar, New Delhi', 'New Delhi', 'Delhi', '110029', 28.5665, 77.2090, '+91-11-26588500', '{"Cardiology", "Oncology", "Neurology", "Orthopedics", "Emergency Medicine"}', '{"ICU", "Emergency", "Blood Bank", "Pharmacy", "Ambulance"}', 4.8, 2500, true, 150, 2500, 'Premier medical institute providing comprehensive healthcare services'),
('Tata Memorial Hospital', 'Dr Ernest Borges Marg, Parel', 'Mumbai', 'Maharashtra', '400012', 19.0176, 72.8413, '+91-22-24177000', '{"Oncology", "Cancer Treatment", "Radiation Therapy", "Surgical Oncology"}', '{"Cancer Care", "Radiation Therapy", "Chemotherapy", "Blood Bank", "Pharmacy"}', 4.7, 1800, true, 80, 629, 'Leading cancer treatment and research center'),
('Apollo Hospital Chennai', 'No.21, Greams Lane, Off Greams Road', 'Chennai', 'Tamil Nadu', '600006', 13.0651, 80.2570, '+91-44-28290200', '{"Cardiology", "Neurology", "Orthopedics", "Gastroenterology", "Emergency Medicine"}', '{"ICU", "Emergency", "Blood Bank", "Pharmacy", "Ambulance", "CT Scan", "MRI"}', 4.6, 3200, true, 120, 1000, 'Multi-specialty hospital with advanced medical facilities'),
('Fortis Hospital Bangalore', '154/9, Bannerghatta Road', 'Bangalore', 'Karnataka', '560076', 12.8996, 77.6019, '+91-80-66214444', '{"Cardiology", "Neurology", "Orthopedics", "Oncology", "Emergency Medicine"}', '{"ICU", "Emergency", "Blood Bank", "Pharmacy", "Ambulance"}', 4.5, 2100, true, 95, 400, 'Advanced healthcare with cutting-edge technology'),
('PGIMER Chandigarh', 'Sector-12, Chandigarh', 'Chandigarh', 'Chandigarh', '160012', 30.7675, 76.7754, '+91-172-2747585', '{"Cardiology", "Neurology", "Orthopedics", "Emergency Medicine", "Pediatrics"}', '{"ICU", "Emergency", "Blood Bank", "Pharmacy", "Ambulance"}', 4.7, 1500, true, 110, 1800, 'Postgraduate Institute of Medical Education and Research');

-- Insert sample hotel data for major Indian cities
INSERT INTO public.hotels (name, address, city, state, pincode, latitude, longitude, phone, star_rating, amenities, room_types, price_range, rating, total_reviews, rooms_available, total_rooms, description) VALUES
('The Taj Mahal Hotel Delhi', '1, Mansingh Road', 'New Delhi', 'Delhi', '110011', 28.6139, 77.2090, '+91-11-23026162', 5, '{"WiFi", "Restaurant", "Spa", "Gym", "Pool", "Room Service", "Laundry"}', '{"Deluxe", "Premium", "Suite"}', '₹15000-₹50000', 4.8, 5200, 45, 294, 'Luxury hotel with world-class amenities'),
('Hotel Suba Palace Mumbai', '196, Dr Annie Besant Road, Worli', 'Mumbai', 'Maharashtra', '400018', 19.0144, 72.8181, '+91-22-24360636', 4, '{"WiFi", "Restaurant", "Gym", "Room Service", "Laundry", "Conference Hall"}', '{"Standard", "Deluxe", "Executive"}', '₹8000-₹20000', 4.3, 2800, 28, 125, 'Comfortable business hotel in prime location'),
('The Park Chennai', '601, Anna Salai, Nungambakkam', 'Chennai', 'Tamil Nadu', '600006', 13.0569, 80.2412, '+91-44-42674000', 5, '{"WiFi", "Restaurant", "Spa", "Gym", "Pool", "Room Service", "Bar"}', '{"Superior", "Deluxe", "Suite"}', '₹12000-₹35000', 4.6, 3100, 35, 219, 'Contemporary luxury hotel with modern facilities'),
('ITC Windsor Bangalore', '25, Golf Course Road', 'Bangalore', 'Karnataka', '560052', 12.9698, 77.5985, '+91-80-22269898', 5, '{"WiFi", "Restaurant", "Spa", "Gym", "Pool", "Room Service", "Business Center"}', '{"Deluxe", "Club", "Suite"}', '₹18000-₹60000', 4.7, 4200, 52, 240, 'Premium hotel with exceptional service and amenities'),
('Hotel Mountview Chandigarh', 'Sector-10, Chandigarh', 'Chandigarh', 'Chandigarh', '160011', 30.7485, 76.7734, '+91-172-4661111', 4, '{"WiFi", "Restaurant", "Gym", "Room Service", "Conference Hall", "Laundry"}', '{"Standard", "Deluxe", "Executive"}', '₹6000-₹15000', 4.2, 1200, 22, 105, 'Comfortable hotel with excellent location and service');
