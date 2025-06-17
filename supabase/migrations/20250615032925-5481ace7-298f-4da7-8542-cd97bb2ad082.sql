
-- Create companions table
CREATE TABLE public.companions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  experience TEXT NOT NULL,
  location TEXT NOT NULL,
  bio TEXT,
  price TEXT NOT NULL,
  languages TEXT[] DEFAULT '{}',
  specialties TEXT[] DEFAULT '{}',
  rating DECIMAL(2,1) DEFAULT 0.0,
  reviews INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  join_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.companions ENABLE ROW LEVEL SECURITY;

-- Create policies for CRUD operations
-- For now, making it public accessible (you can add authentication later)
CREATE POLICY "Anyone can view companions" 
  ON public.companions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create companions" 
  ON public.companions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update companions" 
  ON public.companions 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete companions" 
  ON public.companions 
  FOR DELETE 
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_companions_updated_at 
    BEFORE UPDATE ON public.companions 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();
