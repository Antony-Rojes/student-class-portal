import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { browserLocalPersistence, setPersistence } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      } else {
        setChecking(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Persist session across page refreshes and browser restarts
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  // Show nothing while checking auth state to avoid flicker
  if (checking) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAFAF8",
        fontFamily: "DM Sans, sans-serif",
        color: "#9C9488",
        fontSize: "14px",
      }}>
        Checking session...
      </div>
    );
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div className="login-page">
        <div className="bg-grid" />
        <div className="bg-glow bg-glow-one" />
        <div className="bg-glow bg-glow-two" />

        <section className="login-right">
          <div className="login-card">
            <div className="login-card-bar" />

            <div className="card-top">
              <div className="card-kicker">Sign in</div>
              <h2 className="card-title">Welcome to III CSE-A</h2>
              <p className="card-subtitle">Sign in to continue to your class workspace.</p>
            </div>

            <div className="form-group">
              <label className="label">Email Address</label>
              <input
                className="input"
                type="email"
                placeholder="rollno@kpriet.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {error && <div className="error-box">⚠ {error}</div>}

            <button className="login-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
              <span className="btn-arrow">→</span>
            </button>

            <div className="footer-note">Access is provided only by your class admin.</div>
          </div>
        </section>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          min-height: 100%;
        }

        :root {
          --bg: #FAFAF8;
          --surface: #FFFFFF;
          --surface-2: #F5F3EE;
          --surface-3: #EEEAE0;
          --border: rgba(26, 23, 20, 0.08);
          --border-md: rgba(26, 23, 20, 0.14);
          --text: #1A1714;
          --text-soft: #5C554A;
          --text-mute: #9C9488;
          --orange: #E8642A;
          --orange-deep: #C44D18;
          --orange-light: #FDF0E8;
          --orange-dim: rgba(232, 100, 42, 0.08);
          --orange-border: rgba(232, 100, 42, 0.22);
          --orange-glow: rgba(232, 100, 42, 0.15);
          --r-sm: 12px;
          --r-md: 18px;
          --r-lg: 28px;
          --r-pill: 999px;
        }

        body {
          font-family: "DM Sans", sans-serif;
          background: var(--bg);
          color: var(--text);
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: var(--bg);
          padding: 24px;
        }

        .bg-grid {
          position: fixed;
          inset: 0;
          background-image: radial-gradient(circle, rgba(26, 23, 20, 0.045) 1px, transparent 1px);
          background-size: 26px 26px;
          pointer-events: none;
          z-index: 0;
        }

        .bg-glow {
          position: fixed;
          border-radius: 999px;
          filter: blur(18px);
          pointer-events: none;
          z-index: 0;
        }

        .bg-glow-one {
          width: 520px;
          height: 520px;
          left: -120px;
          top: -100px;
          background: rgba(232, 100, 42, 0.08);
        }

        .bg-glow-two {
          width: 460px;
          height: 460px;
          right: -120px;
          bottom: -120px;
          background: rgba(232, 100, 42, 0.05);
        }

        .login-left,
        .login-right {
          position: relative;
          z-index: 1;
          width: 100%;
          min-height: calc(100vh - 48px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-left {
          padding: 24px;
        }

        .brand-wrap {
          width: 100%;
          max-width: 640px;
        }

        .login-right {
          padding: 24px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-card {
          position: relative;
          width: 100%;
          max-width: 430px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid var(--border-md);
          border-radius: var(--r-lg);
          box-shadow:
            0 2px 10px rgba(26, 23, 20, 0.05),
            0 24px 64px rgba(26, 23, 20, 0.10);
          padding: 34px 30px 26px;
          overflow: hidden;
          backdrop-filter: blur(16px);
        }

        .login-card-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--orange-deep), #F3A46F, var(--orange-deep));
        }

        .card-top {
          margin-bottom: 20px;
        }

        .card-kicker {
          font-family: "JetBrains Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 10px;
        }

        .card-title {
          margin: 0;
          font-family: "Fraunces", serif;
          font-size: 34px;
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--text);
        }

        .card-subtitle {
          margin: 10px 0 0 0;
          font-size: 14px;
          line-height: 1.7;
          color: var(--text-soft);
          font-weight: 300;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 14px;
        }

        .label {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-soft);
        }

        .input {
          width: 100%;
          border: 1.5px solid var(--border-md);
          border-radius: 12px;
          background: var(--surface-2);
          color: var(--text);
          font-size: 14px;
          padding: 13px 14px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .input::placeholder {
          color: var(--text-mute);
        }

        .input:focus {
          border-color: var(--orange-border);
          background: #fff;
          box-shadow: 0 0 0 4px var(--orange-dim);
        }

        .error-box {
          margin-top: 4px;
          margin-bottom: 2px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          color: #DC2626;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 13px;
          line-height: 1.5;
        }

        .login-btn {
          width: 100%;
          margin-top: 8px;
          border: none;
          border-radius: 12px;
          background: var(--orange);
          color: #fff;
          padding: 14px 16px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, gap 0.2s ease;
          box-shadow: 0 8px 24px var(--orange-glow);
        }

        .login-btn:hover:not(:disabled) {
          background: var(--orange-deep);
          transform: translateY(-1px);
          gap: 14px;
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-arrow {
          transition: transform 0.2s ease;
        }

        .login-btn:hover:not(:disabled) .btn-arrow {
          transform: translateX(2px);
        }

        .footer-note {
          margin-top: 14px;
          text-align: center;
          font-size: 12px;
          line-height: 1.6;
          color: var(--text-mute);
        }

        @media (max-width: 980px) {
          .login-page {
            grid-template-columns: 1fr;
            place-items: center;
          }

          .login-left {
            display: none;
          }

          .login-card {
            max-width: 430px;
          }
        }

        @media (max-width: 640px) {
          .login-page {
            padding: 16px;
          }

          .card-title {
            font-size: 28px;
          }

          .card-subtitle {
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
}

export default Login;