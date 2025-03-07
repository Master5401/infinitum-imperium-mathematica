
-- Create table for special numbers
CREATE TABLE IF NOT EXISTS public.special_numbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  formula TEXT,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.special_numbers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view special numbers
CREATE POLICY "Anyone can view special numbers" 
  ON public.special_numbers 
  FOR SELECT 
  USING (true);

-- Create policy to allow authenticated users to insert special numbers
CREATE POLICY "Authenticated users can insert special numbers" 
  ON public.special_numbers 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Create policy to allow guests to insert special numbers
CREATE POLICY "Guests can insert special numbers" 
  ON public.special_numbers 
  FOR INSERT 
  TO anon
  WITH CHECK (true);
