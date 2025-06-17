
-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  companion_id UUID NOT NULL REFERENCES public.companions(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_age INTEGER,
  phone TEXT NOT NULL,
  email TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  hospital_name TEXT NOT NULL,
  hospital_address TEXT,
  doctor_name TEXT,
  visit_type TEXT,
  special_requirements TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled', 'completed')),
  total_amount INTEGER NOT NULL, -- storing in cents for precision
  service_fee INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings (for now allowing all operations, you can restrict later with authentication)
CREATE POLICY "Anyone can view bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update bookings" 
  ON public.bookings 
  FOR UPDATE 
  USING (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON public.bookings 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();
