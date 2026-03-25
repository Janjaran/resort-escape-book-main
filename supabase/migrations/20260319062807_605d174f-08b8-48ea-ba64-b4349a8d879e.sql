CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  guest_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  guests integer NOT NULL DEFAULT 1,
  special_requests text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can insert bookings (public booking form)
CREATE POLICY "Anyone can insert bookings"
  ON public.bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Anyone can read bookings (needed for availability checks)
CREATE POLICY "Anyone can read bookings"
  ON public.bookings FOR SELECT
  TO anon, authenticated
  USING (true);