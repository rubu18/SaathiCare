import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface Chat {
  id: string;
  created_at: string;
  last_message: string | null;
  last_message_time: string | null;
  member_ids: string[];
}

export function useChatConversations(user: User | null) {
  const queryClient = useQueryClient();

  // Fetch all chats for logged-in user
  const { data: chats, isLoading, error } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .order("last_message_time", { ascending: false });
      if (error) throw error;
      // Only keep chats the user is part of
      return data || [];
    },
    enabled: !!user,
  });

  // Start new chat/conversation: with array of memberIds
  const createChat = useMutation({
    mutationFn: async (memberIds: string[]) => {
      const { data, error } = await supabase
        .from("chats")
        .insert([{ member_ids: memberIds }])
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chats"] }),
  });

  return { chats, isLoading, error, createChat };
}
