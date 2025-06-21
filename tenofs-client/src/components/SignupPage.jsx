import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // ...other state as needed
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // Your signup logic here
    setIsAuthenticated(true);
    navigate("/dashboard");
  };

  return (
    <section className="page signup-page">
      <h2>Sign Up</h2>
      <form className="signup-form" onSubmit={handleSignup}>
        <input
          className="input-field"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {/* Add other signup fields as needed */}
        <button className="btn" type="submit">
  Sign Up
</button>
      </form>
      <div style={{ marginTop: "16px", textAlign: "center" }}>
      <button
  type="button"
  className="btn"
  onClick={() => navigate("/login")}
>
  Already have an account? Login
</button>
</div>
    </section>
  );
}

export default SignupPage;