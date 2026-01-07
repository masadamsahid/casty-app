"use client";

import { useEffect, useState, useRef } from "react";
import { getRoomMessages, sendMessage, type ChatMessage } from "@/lib/api/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface ChatRoomProps {
    roomId: string;
    currentUserId: string;
}

export default function ChatRoom({ roomId, currentUserId }: ChatRoomProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [content, setContent] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        try {
            const res = await getRoomMessages(roomId);
            if (res.success) {
                setMessages(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        // Polling for new messages every 5 seconds (temporary since no websocket)
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [roomId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || sending) return;

        setSending(true);
        try {
            const res = await sendMessage(roomId, content.trim());
            if (res.success) {
                setContent("");
                fetchMessages();
            }
        } catch (error: any) {
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[500px]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px] border rounded-2xl bg-muted/5">
            <div className="p-4 border-b bg-card rounded-t-2xl">
                <h3 className="font-semibold flex items-center gap-2">
                    <MessageSquareIcon className="w-4 h-4" />
                    Messages
                </h3>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.length > 0 ? (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`flex items-end gap-2 max-w-[80%] ${msg.senderId === currentUserId ? "flex-row-reverse" : "flex-row"}`}>
                                    <Avatar className="h-8 w-8 mb-1 border shrink-0">
                                        <AvatarImage src={msg.sender?.image} alt={msg.sender?.name} />
                                        <AvatarFallback>{msg.sender?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <div className={`px-4 py-2 rounded-2xl text-sm ${msg.senderId === currentUserId
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-muted rounded-bl-none"
                                            }`}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                            {format(new Date(msg.createdAt), "HH:mm")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-sm text-muted-foreground">Start the conversation!</p>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <div className="p-4 border-t bg-card rounded-b-2xl">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        placeholder="Type a message..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="flex-1"
                        disabled={sending}
                    />
                    <Button type="submit" size="icon" disabled={!content.trim() || sending}>
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </form>
            </div>
        </div>
    );
}

function MessageSquareIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    )
}
