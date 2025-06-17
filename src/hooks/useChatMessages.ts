
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export function useChatMessages(
  chatId: string | null,
  user: User | null,
  onNewMessage?: (m: Message) => void
) {
  const queryClient = useQueryClient();

  // Fetch messages for chatId
  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      if (!chatId) return [];
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!chatId,
  });

  // Send a new message
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!chatId) throw new Error("No chat selected");
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            chat_id: chatId,
            content,
            sender_id: user.id,
          },
        ])
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["messages", chatId],
      }),
  });

  // Optional: Real-time updates for new messages in this chat
  useEffect(() => {
    if (!chatId) return;
    const channel = supabase
      .channel("messages-" + chatId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
          if (onNewMessage && payload.new) onNewMessage(payload.new as Message);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, queryClient, onNewMessage]);

  return { messages, isLoading, error, sendMessage };
}
