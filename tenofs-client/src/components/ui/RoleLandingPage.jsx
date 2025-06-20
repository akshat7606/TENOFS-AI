import React from "react";
import { useNavigate } from "react-router-dom";

function RoleLandingPage() {
  const navigate = useNavigate();

  return (
    <section className="page role-landing-page flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Welcome to Tenofs</h2>
      <p className="text-lg mb-8">Choose an option to get started:</p>
      <div className="flex flex-col space-y-4 w-full max-w-sm">
        <button
          className="btn primary w-full"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="btn secondary w-full"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
        <button
          className="btn secondary w-full"
          onClick={() => navigate("/try-it-first")}
        >
          Try It First
        </button>
      </div>
    </section>
  );
} 
export default RoleLandingPage;