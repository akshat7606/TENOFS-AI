import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-start px-6 py-4 bg-white bg-opacity-70 backdrop-blur-md fixed top-0 w-full z-10">
      <Link to="/" className="flex items-center space-x-3">
        <img src="/logo.png" alt="Tenofs Logo" className="h-10 w-10" />
        <span className="text-xl font-bold text-purple-700">Tenofs</span>
      </Link>
    </nav>
  );
}
