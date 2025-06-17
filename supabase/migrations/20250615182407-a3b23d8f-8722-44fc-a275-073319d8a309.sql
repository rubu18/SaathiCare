
-- Create chats table (1:1, ready for future group chats)
CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message TEXT,
  last_message_time TIMESTAMPTZ,
  -- If group chat, add group fields later!
  member_ids UUID[] NOT NULL -- array of user IDs (auth.users)
);

-- Enable RLS & policies
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- Only allow read/write if user is a member
CREATE POLICY "Members can access own chats" ON public.chats
  FOR SELECT USING (auth.uid() = ANY(member_ids));
CREATE POLICY "Members can insert chats" ON public.chats
  FOR INSERT WITH CHECK (auth.uid() = ANY(member_ids));
CREATE POLICY "Members can update own chats" ON public.chats
  FOR UPDATE USING (auth.uid() = ANY(member_ids));

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES public.chats (id) ON DELETE CASCADE,
  sender_id UUID NOT NULL, -- will use auth.uid()
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS & policies
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Only allow reading, writing, updating messages for chat members
CREATE POLICY "Chat members can read messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chats
      WHERE chats.id = messages.chat_id
      AND auth.uid() = ANY(chats.member_ids)
    )
  );
CREATE POLICY "Chat members can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chats
      WHERE chats.id = messages.chat_id
      AND auth.uid() = ANY(chats.member_ids)
    )
  );
CREATE POLICY "Message sender can update" ON public.messages
  FOR UPDATE USING (
    sender_id = auth.uid()
  );
CREATE POLICY "Message sender can delete" ON public.messages
  FOR DELETE USING (
    sender_id = auth.uid()
  );
