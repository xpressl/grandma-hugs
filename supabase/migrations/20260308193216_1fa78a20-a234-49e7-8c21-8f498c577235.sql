
INSERT INTO storage.buckets (id, name, public) VALUES ('family-music', 'family-music', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can read music files" ON storage.objects FOR SELECT USING (bucket_id = 'family-music');
CREATE POLICY "Anyone can upload music files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'family-music');
CREATE POLICY "Anyone can delete music files" ON storage.objects FOR DELETE USING (bucket_id = 'family-music');
