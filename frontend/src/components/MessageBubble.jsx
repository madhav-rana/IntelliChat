// const MessageBubble = ({ role, content }) => {
//   return (
//     <div className={`message-bubble ${role}`}>
//       {content}
//     </div>
//   );
// };

// export default MessageBubble;



import ReactMarkdown from "react-markdown";

const MessageBubble = ({ role, content }) => {
  return (
    <div className={`message-bubble ${role}`}>
      
      <ReactMarkdown>{content}</ReactMarkdown>

    </div>
  );
};

export default MessageBubble;