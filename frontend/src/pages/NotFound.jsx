import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <h1 className="text-primary" style={{ fontSize: 80, fontWeight: 700 }}>404</h1>
      <h4 className="text-white mb-2">Page not found</h4>
      <p className="text-secondary mb-4">The page you're looking for doesn't exist.</p>
      <Link to="/chat" className="btn btn-primary px-4">Go to Chat</Link>
    </div>
  );
};

export default NotFound;