
CREATE TABLE public.access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'family',
  family_member_id uuid REFERENCES public.family_members(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read access codes" ON public.access_codes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert access codes" ON public.access_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update access codes" ON public.access_codes FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete access codes" ON public.access_codes FOR DELETE USING (true);

-- Insert a default admin code
INSERT INTO public.access_codes (code, name, role) VALUES ('admin2024', 'Admin', 'admin');
