
-- Create family_members table
CREATE TABLE public.family_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  hebrew_name TEXT,
  photo_url TEXT,
  relationship TEXT NOT NULL,
  birthday_english DATE,
  birthday_hebrew TEXT,
  birth_year INTEGER,
  parent_id UUID REFERENCES public.family_members(id) ON DELETE SET NULL,
  spouse_id UUID REFERENCES public.family_members(id) ON DELETE SET NULL,
  generation INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create occasions table for music per occasion
CREATE TABLE public.occasions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE,
  occasion_type TEXT NOT NULL,
  title TEXT NOT NULL,
  music_url TEXT,
  music_title TEXT,
  date_english DATE,
  date_hebrew TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('family-photos', 'family-photos', true);

-- Storage policies for family photos
CREATE POLICY "Family photos are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'family-photos');
CREATE POLICY "Anyone can upload family photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'family-photos');
CREATE POLICY "Anyone can update family photos" ON storage.objects FOR UPDATE USING (bucket_id = 'family-photos');
CREATE POLICY "Anyone can delete family photos" ON storage.objects FOR DELETE USING (bucket_id = 'family-photos');

-- RLS on family_members - public read, open write (single admin app)
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read family members" ON public.family_members FOR SELECT USING (true);
CREATE POLICY "Anyone can insert family members" ON public.family_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update family members" ON public.family_members FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete family members" ON public.family_members FOR DELETE USING (true);

-- RLS on occasions
ALTER TABLE public.occasions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read occasions" ON public.occasions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert occasions" ON public.occasions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update occasions" ON public.occasions FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete occasions" ON public.occasions FOR DELETE USING (true);

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON public.family_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
