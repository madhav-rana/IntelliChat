// import { useEffect, useRef } from "react";
// import MessageBubble from "./MessageBubble";

// const ChatWindow = ({ messages, streaming }) => {
//   const bottomRef = useRef(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, streaming]);

//   return (
//     <div className="messages-container">
//       {messages.length === 0 && (
//         <div className="text-center text-secondary mt-5">
//           <h5>👋 Welcome to IntelliChat</h5>
//           <p>Start a conversation below</p>
//         </div>
//       )}
//       {messages.map((msg, i) => (
//         <MessageBubble key={i} role={msg.role} content={msg.content} />
//       ))}
//       {streaming && (
//         <div className="message-bubble assistant">
//           <span className="spinner-grow spinner-grow-sm text-secondary" />
//         </div>
//       )}
//       <div ref={bottomRef} />
//     </div>
//   );
// };

// export default ChatWindow;


import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const ChatWindow = ({ messages, streaming }) => {
  const bottomRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  return (
    <div className="messages-container">
      
      {/* Empty state */}
      {messages.length === 0 && (
        <div className="empty-state">
          <h2>👋 Welcome to IntelliChat</h2>
          <p>Start a conversation below</p>
        </div>
      )}

      {/* Messages */}
      {messages.map((msg, i) => (
        <MessageBubble key={i} role={msg.role} content={msg.content} />
      ))}

      {/* Typing cursor instead of spinner */}
      {streaming && (
        <div className="message-bubble assistant">
          <span className="typing-cursor">|</span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;