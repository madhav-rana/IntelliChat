import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import API from "../api/axios";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    const { data } = await API.get("/api/conversations");
    setConversations(data);
  };

  const handleSelect = async (id) => {
    setActiveId(id);
    const { data } = await API.get(`/api/conversations/${id}/messages`);
    setMessages(data);
  };

  const handleNew = () => {
    setActiveId(null);
    setMessages([]);
  };

  const handleDelete = async (id) => {
    await API.delete(`/api/conversations/${id}`);
    if (activeId === id) handleNew();
    fetchConversations();
  };

  const handleRename = async (id) => {
    const title = prompt("Enter new name:");
    if (!title) return;
    await API.patch(`/api/conversations/${id}/rename`, { title });
    fetchConversations();
  };

  const handleSend = async () => {
    if (!input.trim() || streaming) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setStreaming(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            message: userMessage,
            conversationId: activeId
          })
        }
      );

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data:"));

        for (const line of lines) {
          const json = JSON.parse(line.replace("data: ", ""));

          if (json.done) {
            if (!activeId) {
              setActiveId(json.conversationId);
              fetchConversations();
            }
          } else {
            assistantMessage += json.content;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: assistantMessage
              };
              return updated;
            });
          }
        }
      }
    } catch (err) {
      console.error("Stream error:", err);
    } finally {
      setStreaming(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="d-flex">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelect}
        onNew={handleNew}
        onDelete={handleDelete}
        onRename={handleRename}
      />
      <div className="chat-area">
        <ChatWindow messages={messages} streaming={streaming} />
        <div className="input-area">
          <div className="d-flex gap-2">
            <textarea
              rows={1}
              placeholder="Message MyGPT..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="btn btn-primary px-4"
              onClick={handleSend}
              disabled={streaming || !input.trim()}
            >
              {streaming ? (
                <span className="spinner-border spinner-border-sm" />
              ) : "Send"}
            </button>
          </div>
          <p className="text-secondary text-center mt-2 mb-0" style={{ fontSize: 12 }}>
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;