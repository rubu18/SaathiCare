
// WhatsApp/Instagram-like persistent chat with Supabase
import { useState, useRef, useEffect } from "react";
import { Send, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useChatConversations } from "@/hooks/useChatConversations";
import { useChatMessages } from "@/hooks/useChatMessages";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const ChatPage = () => {
  // Get logged-in user (full Supabase User)
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch user on mount
  useEffect(() => {
    let isMounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (isMounted) {
        setUser(data.user ?? null);
        setLoadingUser(false);
      }
    });
    // Also listen for any auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Use chat conversations for the logged-in user
  const { chats = [], isLoading: loadingChats } = useChatConversations(user);

  // Use messages for the currently active chat
  const { messages = [], isLoading: loadingMessages, sendMessage } = useChatMessages(activeChatId, user);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  // Message bubbles: sent/received
  const isMe = (senderId: string) => user?.id === senderId;

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChatId) return;
    try {
      await sendMessage.mutateAsync(newMessage.trim());
      setNewMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been delivered.",
      });
      scrollToBottom();
    } catch (err) {
      toast({ title: "Could not send message", variant: "destructive" });
    }
  };

  // Handle chat select (loads messages)
  const handleChatSwitch = (chatId: string) => {
    setActiveChatId(chatId);
    setTimeout(scrollToBottom, 150);
  };

  // Get initials for avatar fallback
  const getInitials = (ids: string[]) =>
    ids
      .filter((id) => id !== user?.id)
      .map((id) => (id ?? "U").slice(0, 2).toUpperCase())
      .join("");

  if (loadingUser || loadingChats) {
    return (
      <div className="p-6 flex h-[70vh] items-center justify-center">
        <div className="text-gray-500 text-center animate-fade-in">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <Card className="h-full saathi-card flex flex-col">
            <div className="p-4 border-b border-saathi-blue-100 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Chats</span>
              <Navigation />
            </div>
            <ScrollArea className="flex-1">
              {chats.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No conversations yet</div>
              ) : (
                chats.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleChatSwitch(c.id)}
                    className={`flex items-center px-4 py-3 cursor-pointer border-b border-saathi-blue-50 hover:bg-saathi-blue-50 ${
                      activeChatId === c.id ? "bg-saathi-blue-100" : ""
                    }`}
                  >
                    <Avatar>
                      <AvatarFallback className="bg-saathi-blue-200 text-saathi-blue-700">
                        {getInitials(c.member_ids)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-900 text-sm truncate">
                        {c.member_ids.filter((id) => id !== user?.id).join(", ")}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {c.last_message || "No messages yet"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {c.last_message_time
                          ? new Date(c.last_message_time).toLocaleString()
                          : ""}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </Card>
        </div>
        {/* Chat Messages */}
        <div className="lg:col-span-3">
          <Card className="h-full saathi-card flex flex-col">
            {activeChatId ? (
              <>
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                  {loadingMessages ? (
                    <div className="text-center text-gray-500 py-20">
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-16">
                      No messages yet. Type your first message!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className={`flex ${
                            isMe(m.sender_id) ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              isMe(m.sender_id)
                                ? "bg-saathi-blue-500 text-white"
                                : "bg-white border border-saathi-blue-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{m.content}</p>
                            <span
                              className={`block text-xs mt-1 ${
                                isMe(m.sender_id)
                                  ? "text-saathi-blue-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {new Date(m.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>
                {/* Message Input */}
                <div className="p-4 border-t border-saathi-blue-100">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) handleSendMessage();
                      }}
                      placeholder="Message..."
                      className="flex-1 border-saathi-blue-200 focus:border-saathi-blue-500"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="saathi-button"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Messages are end-to-end encrypted and stored securely.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-gray-500">
                <div>
                  <UserCircle className="h-12 w-12 text-saathi-blue-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Start a Conversation</h3>
                  <p>Select a chat or create a new one to begin.</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
