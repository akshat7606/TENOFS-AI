import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../../App";

function LoginPage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetValue, setResetValue] = useState("");
  const [showPhoneLogin, setShowPhoneLogin] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaInitialized = useRef(false);

  // Ensure RecaptchaVerifier is initialized only once per phone login session
  useEffect(() => {
    if (showPhoneLogin && !recaptchaInitialized.current && auth) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          { size: "invisible" },
          auth
        );
        window.recaptchaVerifier.render();
        recaptchaInitialized.current = true;
      } catch (err) {
        // Optionally log or handle error
      }
    }
    // Cleanup when phone login modal is closed
    return () => {
      if (!showPhoneLogin && window.recaptchaVerifier && recaptchaInitialized.current) {
        try {
          window.recaptchaVerifier.clear();
        } catch {}
        window.recaptchaVerifier = undefined;
        recaptchaInitialized.current = false;
      }
    };
  }, [showPhoneLogin, auth]);

  // Email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  // Email reset
  const handleSendResetEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, resetValue);
      alert("Password reset email sent! Please check your inbox.");
      setShowForgotPassword(false);
    } catch (error) {
      alert("Failed to send reset email. Please check the email address.");
    }
  };

  // Phone OTP login
  const handleSendOtp = async () => {
    if (!phone || !/^\+\d{10,15}$/.test(phone)) {
      alert("Please enter a valid phone number with country code (e.g., +919876543210)");
      return;
    }
    try {
      let appVerifier = window.recaptchaVerifier;
      if (!appVerifier) {
        appVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          { size: "invisible" },
          auth
        );
        await appVerifier.render();
        window.recaptchaVerifier = appVerifier;
      }
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
      alert("OTP sent to your phone.");
    } catch (error) {
      alert("Failed to send OTP. " + error.message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await confirmationResult.confirm(otp);
      alert("Logged in successfully!");
      setShowPhoneLogin(false);
      setConfirmationResult(null);
      setPhone("");
      setOtp("");
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <section className="page login-page">
      <h2 className="text-center text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
        />
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="btn primary">
          Login
        </button>
        <div style={{ marginTop: "12px", textAlign: "center" }}>
          <button
            type="button"
            className="btn secondary"
            style={{ background: "none", color: "#007bff", border: "none", boxShadow: "none" }}
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot Password?
          </button>
        </div>
        <div style={{ marginTop: "12px", textAlign: "center" }}>
          <button
            type="button"
            className="btn secondary"
            style={{ background: "none", color: "#007bff", border: "none", boxShadow: "none" }}
            onClick={() => setShowPhoneLogin(true)}
          >
            Login with OTP
          </button>
        </div>
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="btn"
            style={{ padding: "6px 18px", fontSize: "1rem", display: "inline-block" }}
          >
            Sign Up
          </button>
        </div>
      </form>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div style={{
          marginTop: 24,
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 8,
          maxWidth: 350,
          marginLeft: "auto",
          marginRight: "auto",
          background: "#fff"
        }}>
          <h3>Reset Password</h3>
          <input
            type="email"
            className="input-field"
            placeholder="Enter your email"
            value={resetValue}
            onChange={e => setResetValue(e.target.value)}
            style={{ marginBottom: 12 }}
          />
          <button
            className="btn"
            onClick={handleSendResetEmail}
            style={{ marginBottom: 12 }}
          >
            Send Reset Link
          </button>
          <div>
            <button
              className="btn secondary"
              onClick={() => setShowForgotPassword(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Phone OTP Login Modal */}
      {showPhoneLogin && (
        <div style={{
          marginTop: 24,
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 8,
          maxWidth: 350,
          marginLeft: "auto",
          marginRight: "auto",
          background: "#fff"
        }}>
          <h3>Login with OTP</h3>
          {!confirmationResult ? (
            <>
              <input
                type="tel"
                className="input-field"
                placeholder="Enter your phone number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ marginBottom: 12 }}
              />
              <div id="recaptcha-container"></div>
              <button
                className="btn"
                onClick={handleSendOtp}
                style={{ marginBottom: 12 }}
              >
                Send OTP
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                className="input-field"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                style={{ marginBottom: 12 }}
              />
              <button
                className="btn"
                onClick={handleVerifyOtp}
                style={{ marginBottom: 12 }}
              >
                Verify OTP
              </button>
            </>
          )}
          <div>
            <button
              className="btn secondary"
              onClick={() => {
                setShowPhoneLogin(false);
                setConfirmationResult(null);
                setPhone("");
                setOtp("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default LoginPage;