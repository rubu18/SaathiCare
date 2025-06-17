
-- 1. Create an audit_log table for admin access attempts
CREATE TABLE public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  admin_email TEXT,
  event_type TEXT NOT NULL, -- e.g. login_attempt, 2fa_attempt
  event_result TEXT NOT NULL, -- success, fail, locked, etc.
  event_ip TEXT,
  event_description TEXT
);

-- 2. Enable Row Level Security for future authentication use
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- 3. Allow all SELECT/INSERT for now; can be changed later to authenticated only
CREATE POLICY "Allow all admin audit access read" ON public.admin_audit_log
  FOR SELECT
  USING (true);

CREATE POLICY "Allow all admin audit write" ON public.admin_audit_log
  FOR INSERT
  WITH CHECK (true);
