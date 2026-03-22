import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onRename
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      {/* New Chat Button */}
      <button className="btn btn-primary w-100 mb-3" onClick={onNew}>
        + New Chat
      </button>

      {/* Conversations List */}
      <div className="flex-grow-1 overflow-auto">
        {conversations.length === 0 && (
          <p className="text-secondary text-center" style={{ fontSize: 13 }}>
            No conversations yet
          </p>
        )}
        {conversations.map((conv) => (
          <div
            key={conv._id}
            className={`conversation-item d-flex justify-content-between align-items-center ${activeId === conv._id ? "active" : ""}`}
            onClick={() => onSelect(conv._id)}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {conv.title}
            </span>
            <div className="d-flex gap-1 ms-2">
              <button
                className="btn btn-sm p-0 text-secondary"
                style={{ fontSize: 12 }}
                onClick={(e) => { e.stopPropagation(); onRename(conv._id); }}
                title="Rename"
              >✏️</button>
              <button
                className="btn btn-sm p-0 text-secondary"
                style={{ fontSize: 12 }}
                onClick={(e) => { e.stopPropagation(); onDelete(conv._id); }}
                title="Delete"
              >🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* User info + Logout */}
      <div className="mt-auto pt-3 border-top border-secondary">
        <p className="text-secondary mb-1" style={{ fontSize: 13 }}>
          {user?.name}
        </p>
        <button className="btn btn-outline-secondary btn-sm w-100" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;