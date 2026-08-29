import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabase";

export default function OwnerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("owner@manora.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (!data?.user) {
        throw new Error("Login failed.");
      }

      // Owner dashboard
      navigate("/owner-dashboard");
    } catch (err) {
      setError(err.message || "Invalid owner credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="brand">
          MANORA
        </div>

        <div className="access-label">
          OWNER ACCESS
        </div>

        <h1>Welcome back.</h1>

        <p className="description">
          Sign in to access the MANORA owner dashboard.
        </p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="owner@manora.com"
            required
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        {/* NO STAFF LOGIN HERE */}

        <div className="back-link">
          <button onClick={() => navigate("/")}>
            ← Back to website
          </button>
        </div>

      </div>
    </div>
  );
}