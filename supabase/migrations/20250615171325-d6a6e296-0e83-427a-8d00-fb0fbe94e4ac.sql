
-- Create a public storage bucket for government ID PDFs
insert into storage.buckets (id, name, public)
values ('companion-govt-ids', 'companion-govt-ids', true);

-- Grant public read access to files in the bucket
-- (add appropriate RLS or policies as needed for your use case)
-- By default, public buckets are readable by anyone.
