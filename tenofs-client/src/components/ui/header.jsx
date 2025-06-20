import React from "react";
import { useNavigate, Link } from "react-router-dom";

export const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false); // Reset authentication state
    navigate("/"); // Redirect to role selection
  };

  return (
    <header className="bg-purple-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">
          <Link to="/">Tenofs</Link>
        </h1>
        <nav className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
};