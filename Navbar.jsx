import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

import leetcodeIcon  from "../icons/leetcode/leetcode.svg";
import whatsappIcon  from "../icons/whatsapp/whatsapp.svg";
import classroomIcon from "../icons/classroom/classroom.svg";
import linksIcon     from "../icons/links/links.svg";
import socialIcon    from "../icons/social/social.svg";

const navLinks = [
  { label: "LeetCode",  svg: leetcodeIcon,  path: "/leaderboard" },
  { label: "WhatsApp",  svg: whatsappIcon,  path: "/whatsapp" },
  { label: "Classroom", svg: classroomIcon, path: "/classroom" },
  { label: "Links",     svg: linksIcon,     path: "/important-links" },
  { label: "Social",    svg: socialIcon,    path: "/social-media" },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300&family=DM+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className="nb-root">
        <nav className="nb-bar">
          <div className="nb-brand" onClick={() => navigate("/dashboard")}>
            <span className="nb-brand-main">Class</span>
            <em className="nb-brand-sub">Portal</em>
          </div>

          <div className="nb-links">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <button
                  key={link.path}
                  className={`nb-icon-btn ${active ? "nb-icon-btn--active" : ""}`}
                  onClick={() => navigate(link.path)}
                  aria-label={link.label}
                  title={link.label}
                >
                  <img
                    src={link.svg}
                    alt={link.label}
                    className="nb-icon-img"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextSibling.style.display = "flex";
                    }}
                  />
                  <span className="nb-icon-fallback" aria-hidden="true">
                    {link.label.slice(0, 2)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="nb-right">
            <button
              className="nb-avatar"
              onClick={() => navigate("/profile")}
              aria-label="Profile"
            >
              {auth.currentUser?.email?.charAt(0).toUpperCase() ?? "?"}
            </button>

            <button className="nb-logout nb-desktop-only" onClick={handleLogout}>
              Logout
            </button>

            <button
              className="nb-hamburger nb-mobile-only"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className="nb-ham-icon">{menuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </nav>

        <div className="nb-separator" aria-hidden="true" />

        {menuOpen && (
          <div className="nb-drawer">
            <div className="nb-drawer-grid">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  className={`nb-drawer-item ${isActive(link.path) ? "nb-drawer-item--active" : ""}`}
                  onClick={() => { navigate(link.path); setMenuOpen(false); }}
                >
                  <div className={`nb-drawer-icon-wrap ${isActive(link.path) ? "nb-drawer-icon-wrap--active" : ""}`}>
                    <img
                      src={link.svg}
                      alt=""
                      className="nb-drawer-icon-img"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextSibling.style.display = "flex";
                      }}
                    />
                    <span className="nb-drawer-icon-fallback">{link.label.slice(0, 2)}</span>
                  </div>
                  <span className="nb-drawer-label">{link.label}</span>
                </button>
              ))}

              <button
                className="nb-drawer-item"
                onClick={() => { navigate("/profile"); setMenuOpen(false); }}
              >
                <div className="nb-drawer-icon-wrap nb-drawer-icon-wrap--profile">
                  <span className="nb-drawer-profile-letter">
                    {auth.currentUser?.email?.charAt(0).toUpperCase() ?? "?"}
                  </span>
                </div>
                <span className="nb-drawer-label">Profile</span>
              </button>
            </div>

            <div className="nb-drawer-footer">
              <button className="nb-drawer-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; }

        .nb-root {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(250, 250, 248, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          font-family: "DM Sans", "Segoe UI", sans-serif;
        }

        .nb-bar {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          height: 64px;
          padding: 0 28px;
          max-width: 1680px;
          margin: 0 auto;
        }

        .nb-brand {
          display: flex;
          align-items: baseline;
          gap: 7px;
          cursor: pointer;
          justify-self: start;
          user-select: none;
          transition: opacity 0.2s;
        }

        .nb-brand:hover { opacity: 0.75; }

        .nb-brand-main {
          font-family: "Fraunces", serif;
          font-size: 22px;
          font-weight: 300;
          letter-spacing: -0.02em;
          color: #1A1714;
          line-height: 1;
        }

        .nb-brand-sub {
          font-family: "Fraunces", serif;
          font-size: 22px;
          font-weight: 300;
          font-style: italic;
          color: #5C554A;
          line-height: 1;
        }

        .nb-links {
          display: flex;
          align-items: center;
          gap: 100px;
          justify-self: center;
        }

        .nb-icon-btn {
          position: relative;
          width: 46px;
          height: 46px;
          border-radius: 13px;
          background: rgba(232, 100, 42, 0.05);
          border: 1.5px solid rgba(232, 100, 42, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
          transition: all 0.25s ease;
        }

        .nb-icon-btn:hover {
          background: rgba(232, 100, 42, 0.10);
          border-color: rgba(232, 100, 42, 0.35);
          transform: translateY(-1px);
        }

        .nb-icon-btn--active {
          background: rgba(232, 100, 42, 0.1);
          border-color: rgba(232, 100, 42, 0.52);
          box-shadow:
            0 0 0 3px rgba(232, 100, 42, 0.13),
            0 0 14px rgba(232, 100, 42, 0.28);
        }

        .nb-icon-btn--active:hover {
          background: rgba(232, 100, 42, 0.15);
          border-color: rgba(232, 100, 42, 0.68);
          box-shadow:
            0 0 0 4px rgba(232, 100, 42, 0.18),
            0 0 20px rgba(232, 100, 42, 0.32);
        }

        .nb-icon-img {
          width: 28px;
          height: 28px;
          object-fit: contain;
          display: block;
          pointer-events: none;
        }

        .nb-icon-fallback {
          display: none;
          width: 28px;
          height: 28px;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: #5C554A;
          background: rgba(26, 23, 20, 0.08);
          border-radius: 7px;
          pointer-events: none;
        }

        .nb-right {
          display: flex;
          align-items: center;
          gap: 18px;
          justify-self: end;
        }

        .nb-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #F6E7DE;
          border: 1.5px solid rgba(232, 100, 42, 0.35);
          color: #C44D18;
          font-size: 13px;
          font-weight: 700;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
        }

        .nb-avatar:hover {
          background: rgba(232, 100, 42, 0.18);
          border-color: rgba(232, 100, 42, 0.62);
          box-shadow: 0 0 0 3px rgba(232, 100, 42, 0.1);
        }

        .nb-logout {
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          color: #5C554A;
          background: transparent;
          border: 1px solid rgba(26, 23, 20, 0.18);
          padding: 7px 17px;
          border-radius: 9px;
          cursor: pointer;
          transition: color 0.2s, background 0.2s, border-color 0.2s;
        }

        .nb-logout:hover {
          color: #1A1714;
          background: rgba(26, 23, 20, 0.05);
          border-color: rgba(26, 23, 20, 0.32);
        }

        .nb-hamburger {
          background: transparent;
          border: 1px solid rgba(26, 23, 20, 0.16);
          border-radius: 9px;
          padding: 7px 11px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .nb-hamburger:hover { background: rgba(26, 23, 20, 0.05); }

        .nb-ham-icon {
          font-size: 17px;
          color: #5C554A;
          line-height: 1;
        }

        .nb-separator {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(232, 100, 42, 0.0) 5%,
            rgba(232, 100, 42, 0.55) 25%,
            rgba(243, 164, 111, 0.9) 50%,
            rgba(232, 100, 42, 0.55) 75%,
            rgba(232, 100, 42, 0.0) 95%,
            transparent 100%
          );
        }

        .nb-drawer {
          background: rgba(250, 250, 248, 0.97);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(26, 23, 20, 0.07);
        }

        .nb-drawer-grid {
          display: flex;
          flex-direction: column;
          padding: 8px 0 4px;
        }

        .nb-drawer-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(26, 23, 20, 0.05);
          padding: 13px 24px;
          cursor: pointer;
          text-align: left;
          transition: background 0.18s;
          width: 100%;
        }

        .nb-drawer-item:hover { background: rgba(26, 23, 20, 0.03); }

        .nb-drawer-item--active {
          background: rgba(232, 100, 42, 0.05);
          border-bottom-color: rgba(232, 100, 42, 0.1);
        }

        .nb-drawer-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1.5px solid rgba(26, 23, 20, 0.1);
          background: rgba(26, 23, 20, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.18s, border-color 0.18s, box-shadow 0.18s;
        }

        .nb-drawer-icon-wrap--active {
          background: rgba(232, 100, 42, 0.1);
          border-color: rgba(232, 100, 42, 0.45);
          box-shadow:
            0 0 0 3px rgba(232, 100, 42, 0.1),
            0 0 10px rgba(232, 100, 42, 0.2);
        }

        .nb-drawer-icon-wrap--profile {
          background: rgba(232, 100, 42, 0.08);
          border-color: rgba(232, 100, 42, 0.3);
        }

        .nb-drawer-icon-img {
          width: 24px;
          height: 24px;
          object-fit: contain;
          display: block;
        }

        .nb-drawer-icon-fallback {
          display: none;
          width: 24px;
          height: 24px;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: #5C554A;
        }

        .nb-drawer-profile-letter {
          font-size: 15px;
          font-weight: 700;
          color: #C44D18;
        }

        .nb-drawer-label {
          font-size: 14px;
          font-weight: 500;
          color: #1A1714;
          letter-spacing: -0.01em;
        }

        .nb-drawer-item--active .nb-drawer-label { color: #C44D18; }

        .nb-drawer-footer { padding: 12px 24px 20px; }

        .nb-drawer-logout {
          width: 100%;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          background: #E8642A;
          border: none;
          border-radius: 11px;
          padding: 13px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .nb-drawer-logout:hover { background: #C44D18; }

        .nb-desktop-only { display: flex; }
        .nb-mobile-only  { display: none; }

        @media (max-width: 768px) {
          .nb-links        { display: none; }
          .nb-desktop-only { display: none !important; }
          .nb-mobile-only  { display: flex; }
          .nb-bar { grid-template-columns: 1fr auto; }
        }

        @media (max-width: 480px) {
          .nb-bar { padding: 0 16px; }
          .nb-brand-main, .nb-brand-sub { font-size: 19px; }
          .nb-drawer-item { padding: 12px 18px; }
        }
      `}</style>
    </>
  );
}

export default Navbar;