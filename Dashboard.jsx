import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const cards = [
  {
    title: "LeetCode Board",
    desc: "Track coding progress, contest performance, and class leader boards.",
    path: "/leaderboard",
    tag: "Coding",
    tone: "c-orange",
    icon: "🏆",
  },
  {
    title: "WhatsApp Hub",
    desc: "Stay connected through class groups, discussions, and quick updates.",
    path: "/whatsapp",
    tag: "Community",
    tone: "c-green",
    icon: "💬",
  },
  {
    title: "Classroom Links",
    desc: "Access lecture spaces, assignments, and shared academic material.",
    path: "/classroom",
    tag: "Learning",
    tone: "c-violet",
    icon: "📘",
  },
  {
    title: "Useful Resources",
    desc: "Browse forms, sheets, internships, and hand-picked reference links.",
    path: "/important-links",
    tag: "Resources",
    tone: "c-amber",
    icon: "🔗",
  },
  {
    title: "Social Directory",
    desc: "View GitHub and LinkedIn profiles to discover and connect with classmates.",
    path: "/social-media",
    tag: "Network",
    tone: "c-teal",
    icon: "🌐",
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchName = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setName(snap.data().name || "");
    };
    fetchName();
  }, []);

  const firstName = name ? name.split(" ")[0] : "";

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div className="dashboard-shell">
        <Navbar />

        <div className="bg-grid" />
        <div className="bg-glow bg-glow-left" />
        <div className="bg-glow bg-glow-right" />

        <main className="main">
          <section className="page-header">
            <div className="header-text">
              <div className="eyebrow">
                <span className="eyebrow-dash" />
                Student Workspace
              </div>

              <h1 className="page-heading">
                {getGreeting()}
                {firstName ? `, ${firstName}` : ""} <br />
              </h1>
            </div>

            <div className="meta-block">
              <div className="meta-time">DASHBOARD</div>
              <div className="meta-date">{today}</div>
            </div>
          </section>

          <section className="dashboard">
            {/* Removed onClick to make this a static, non-clickable banner */}
            <article className="hero-card">
              <div className="hero-inner">
                <div className="hero-body">
                  <div>
                    <h2 className="hero-title">
                      <span>III CSE-A</span>
                    </h2>
                  </div>

                  <p className="hero-desc">
                    Stay connected with your classmates, track collective progress, and move forward together as a team.
                  </p>
                </div>

                <div className="hero-media">
                  <img
                    src="/images/class-photo.jpg"
                    alt="Class group photo"
                    className="hero-photo"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="hero-photo-placeholder">
                    <span className="placeholder-icon">📸</span>
                    <span className="placeholder-text">Class Group Photo</span>
                  </div>
                </div>
              </div>
            </article>

            <div className="features-grid">
              {cards.map((item) => (
                <article
                  key={item.path}
                  className={`feature-card ${item.tone}`}
                  onClick={() => navigate(item.path)}
                >
                  <div className="card-top">
                    <div className="card-icon">{item.icon}</div>
                    <div className="card-arrow">
                      <svg className="arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <div className="card-tag">{item.tag}</div>
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-desc">{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="status-bar">
              <div className="status-left">
                <a 
                  href="https://linkedin.com/in/antont-rojes/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="status-item"
                  style={{ textDecoration: 'none' }}
                >
                  <span className="s-dot active" />
                  LinkedIn
                </a>
                <div className="status-div" />
                <a 
                  href="https://antony-rojes.github.io/antony-rojes-portfolio/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="status-item"
                  style={{ textDecoration: 'none' }}
                >
                  <span className="s-dot active" />
                  Portfolio
                </a>
              </div>
              <div className="status-right">
                <span style={{ color: 'var(--orange)' }}>Founded by</span> M Antony Rojes
              </div>
            </div>
          </section>
        </main>

        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }

          :root {
            --bg: #FAFAF8;
            --surface: #FFFFFF;
            --surface-2: #F5F3EE;
            --surface-3: #EEEAE0;
            --border: rgba(26, 23, 20, 0.07);
            --border-md: rgba(26, 23, 20, 0.13);
            --border-strong: rgba(26, 23, 20, 0.2);
            --text: #1A1714;
            --text-soft: #5C554A;
            --text-mute: #9C9488;
            --orange: #E8642A;
            --orange-mid: #F5A66E;
            --orange-deep: #C44D18;
            --orange-glow: rgba(232, 100, 42, 0.13);
            --orange-border: rgba(232, 100, 42, 0.22);
            --orange-dim: rgba(232, 100, 42, 0.08);
            --violet: #7C3AED;
            --violet-dim: rgba(124, 58, 237, 0.08);
            --violet-border: rgba(124, 58, 237, 0.2);
            --amber: #D97706;
            --amber-dim: rgba(217, 119, 6, 0.08);
            --amber-border: rgba(217, 119, 6, 0.2);
            --green: #059669;
            --green-dim: rgba(5, 150, 105, 0.08);
            --green-border: rgba(5, 150, 105, 0.2);
            --teal: #0891B2;
            --teal-dim: rgba(8, 145, 178, 0.08);
            --teal-border: rgba(8, 145, 178, 0.2);
            --r-sm: 10px;
            --r-md: 16px;
            --r-lg: 24px;
            --r-pill: 999px;
          }

          html, body, #root {
            min-height: 100%;
            background: var(--bg);
          }

          body {
            font-family: "DM Sans", sans-serif;
            background: var(--bg);
            color: var(--text);
            overflow-x: hidden;
          }

          .dashboard-shell {
            min-height: 100vh;
            position: relative;
            background: var(--bg);
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
            filter: blur(24px);
            pointer-events: none;
            z-index: 0;
          }

          .bg-glow-left {
            width: 620px; height: 520px;
            left: -180px; top: -80px;
            background: rgba(232, 100, 42, 0.06);
          }

          .bg-glow-right {
            width: 540px; height: 480px;
            right: -180px; bottom: -100px;
            background: rgba(232, 100, 42, 0.05);
          }

          .main {
            width: 100%;
            max-width: 1680px;
            margin: 0 auto;
            padding: 2.75rem 2rem 5rem;
            position: relative;
            z-index: 5;
          }

          .page-header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 1rem;
            margin-bottom: 2.25rem;
            animation: fadeUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .header-text { flex: 1; min-width: 0; }

          .eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 9px;
            font-family: "JetBrains Mono", monospace;
            font-size: 0.64rem;
            font-weight: 400;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: var(--orange);
            margin-bottom: 0.8rem;
          }

          .eyebrow-dash {
            width: 20px; height: 1.5px;
            background: var(--orange);
            opacity: 0.55;
          }

          .page-heading {
            font-family: "Fraunces", serif;
            font-size: clamp(1.75rem, 4vw, 3.2rem);
            font-weight: 300;
            line-height: 1.08;
            letter-spacing: -0.03em;
          }

          .page-heading em {
            font-style: italic;
            color: var(--text-soft);
          }

          .page-sub {
            margin-top: 0.7rem;
            font-size: 0.92rem;
            color: var(--text-soft);
            font-weight: 300;
            line-height: 1.72;
            max-width: 48ch;
          }

          .meta-block { text-align: right; flex-shrink: 0; }

          .meta-time {
            font-family: "JetBrains Mono", monospace;
            font-size: 0.7rem;
            color: var(--text-mute);
            letter-spacing: 0.06em;
          }

          .meta-date {
            font-size: 0.8rem;
            color: var(--text-soft);
            font-weight: 300;
            margin-top: 3px;
          }

          .dashboard {
            display: flex;
            flex-direction: column;
            gap: 1.1rem;
          }

          .hero-card {
            background: var(--surface);
            border: 1.5px solid var(--orange-border);
            border-radius: var(--r-lg);
            overflow: hidden;
            position: relative;
            box-shadow: 0 12px 40px var(--orange-glow);
            animation: fadeUp 0.7s 0.08s cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .hero-inner {
            display: grid;
            grid-template-columns: 1.05fr 1.35fr;
          }

          .hero-body {
            padding: 1.9rem 2rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            border-right: 1px solid var(--border);
          }

          .live-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: var(--orange-dim);
            border: 1px solid var(--orange-border);
            padding: 5px 11px 5px 8px;
            border-radius: var(--r-pill);
            width: fit-content;
          }

          .live-dot {
            width: 6px; height: 6px;
            background: var(--orange);
            border-radius: 50%;
            animation: pulseDot 2.2s ease infinite;
          }

          .live-badge span:last-child {
            font-family: "JetBrains Mono", monospace;
            font-size: 0.6rem;
            letter-spacing: 0.11em;
            text-transform: uppercase;
            color: var(--orange);
          }

          .hero-title {
            font-family: "Fraunces", serif;
            font-size: clamp(1.6rem, 3vw, 2.35rem);
            font-weight: 300;
            line-height: 1.08;
            letter-spacing: -0.025em;
          }

          .hero-title span {
            display: block;
            font-style: italic;
            color: var(--text-soft);
          }

          .hero-desc {
            font-size: 0.86rem;
            color: var(--text-soft);
            line-height: 1.68;
            font-weight: 300;
          }

          .hero-media {
            position: relative;
            overflow: hidden;
            border-radius: 0 var(--r-lg) var(--r-lg) 0;
            min-height: 200px;
            max-height: 220px;
          }

          .hero-photo {
            width: 100%;
            height: 100%;
            max-height: 280px;
            object-fit: contain;
            object-position: center;
            display: block;
            border-radius: 0 var(--r-lg) var(--r-lg) 0;
            background: var(--orange-dim);
          }

          .hero-photo-placeholder {
            display: none;
            width: 100%;
            height: 100%;
            min-height: 220px;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 10px;
            background: var(--surface-2);
            border-radius: 0 var(--r-lg) var(--r-lg) 0;
          }

          .placeholder-icon { font-size: 2.5rem; }

          .placeholder-text {
            font-family: "JetBrains Mono", monospace;
            font-size: 0.65rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--text-mute);
          }

          .features-grid {
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 1rem;
          }

          .feature-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--r-md);
            padding: 1.15rem 1.15rem 1.05rem;
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            box-shadow: 0 1px 4px rgba(26,23,20,0.04);
            transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
          }

          .feature-card::before {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 3px;
            background: var(--accent-color);
            border-radius: var(--r-md) var(--r-md) 0 0;
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
          }

          .feature-card:hover::before { transform: scaleX(1); }

          .feature-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 32px rgba(26,23,20,0.09);
          }

          .c-orange { --accent-color: var(--orange); }
          .c-violet { --accent-color: var(--violet); }
          .c-amber  { --accent-color: var(--amber); }
          .c-green  { --accent-color: var(--green); }
          .c-teal   { --accent-color: var(--teal); }

          .c-orange:hover { border-color: var(--orange-border); }
          .c-violet:hover { border-color: var(--violet-border); }
          .c-amber:hover  { border-color: var(--amber-border); }
          .c-green:hover  { border-color: var(--green-border); }
          .c-teal:hover   { border-color: var(--teal-border); }

          .card-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
          }

          .card-icon {
            width: 44px; height: 44px;
            border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            font-size: 19px;
            flex-shrink: 0;
            transition: transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .feature-card:hover .card-icon { transform: scale(1.1) rotate(-6deg); }

          .c-orange .card-icon { background: var(--orange-dim); border: 1px solid var(--orange-border); }
          .c-violet .card-icon { background: var(--violet-dim); border: 1px solid var(--violet-border); }
          .c-amber  .card-icon { background: var(--amber-dim);  border: 1px solid var(--amber-border); }
          .c-green  .card-icon { background: var(--green-dim);  border: 1px solid var(--green-border); }
          .c-teal   .card-icon { background: var(--teal-dim);   border: 1px solid var(--teal-border); }

          .card-arrow {
            width: 29px; height: 29px;
            border-radius: 8px;
            background: var(--surface-2);
            border: 1px solid var(--border-md);
            display: flex; align-items: center; justify-content: center;
            color: var(--text-mute);
            transition: background 0.22s, color 0.22s, border-color 0.22s, transform 0.22s;
          }

          .feature-card:hover .card-arrow { transform: translate(2px, -2px); border-color: transparent; }

          .c-orange:hover .card-arrow { background: var(--orange); color: #fff; }
          .c-violet:hover .card-arrow { background: var(--violet); color: #fff; }
          .c-amber:hover  .card-arrow { background: var(--amber);  color: #fff; }
          .c-green:hover  .card-arrow { background: var(--green);  color: #fff; }
          .c-teal:hover   .card-arrow { background: var(--teal);   color: #fff; }

          .arrow-svg { width: 12px; height: 12px; }

          .card-tag {
            display: inline-flex;
            font-family: "JetBrains Mono", monospace;
            font-size: 0.56rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            padding: 3px 9px;
            border-radius: var(--r-sm);
            width: fit-content;
            margin-bottom: 6px;
          }

          .c-orange .card-tag { background: var(--orange-dim); color: var(--orange-deep); border: 1px solid var(--orange-border); }
          .c-violet .card-tag { background: var(--violet-dim); color: var(--violet);      border: 1px solid var(--violet-border); }
          .c-amber  .card-tag { background: var(--amber-dim);  color: var(--amber);        border: 1px solid var(--amber-border); }
          .c-green  .card-tag { background: var(--green-dim);  color: var(--green);        border: 1px solid var(--green-border); }
          .c-teal   .card-tag { background: var(--teal-dim);   color: var(--teal);         border: 1px solid var(--teal-border); }

          .card-title {
            font-family: "Fraunces", serif;
            font-size: 1rem;
            font-weight: 400;
            letter-spacing: -0.015em;
            color: var(--text);
            margin-bottom: 4px;
            line-height: 1.18;
          }

          .card-desc {
            font-size: 0.76rem;
            color: var(--text-soft);
            line-height: 1.58;
            font-weight: 300;
          }

          .status-bar {
            margin-top: 0.1rem;
            background: var(--surface);
            border: 1px solid var(--border-md);
            border-radius: var(--r-md);
            padding: 0.95rem 1.35rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 0.6rem;
            box-shadow: 0 1px 4px rgba(26,23,20,0.04);
            animation: fadeUp 0.6s 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .status-left {
            display: flex;
            align-items: center;
            gap: 1.15rem;
            flex-wrap: wrap;
          }

          .status-item {
            display: flex;
            align-items: center;
            gap: 7px;
            font-size: 0.78rem;
            color: var(--text-mute);
          }

          .s-dot {
            width: 6px; height: 6px;
            border-radius: 50%;
            flex-shrink: 0;
          }

          .s-dot.active {
            background: var(--green);
            animation: pulseDot 2s ease infinite;
          }

          .status-div {
            width: 1px; height: 16px;
            background: var(--border-md);
          }

          .status-right {
            font-family: "JetBrains Mono", monospace;
            font-size: 0.62rem;
            color: var(--text-mute);
            letter-spacing: 0.06em;
            flex-shrink: 0;
          }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          @keyframes pulseDot {
            0%, 100% { box-shadow: 0 0 0 0 rgba(232,100,42,0.45); }
            55%       { box-shadow: 0 0 0 5px rgba(232,100,42,0); }
          }

          @keyframes tdBounce {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
            40%            { transform: translateY(-4px); opacity: 1; }
          }

          @media (max-width: 1280px) {
            .features-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          }

          @media (max-width: 980px) {
            .main { padding: 2rem 1.5rem 4rem; }
            .hero-inner { grid-template-columns: 1fr; }
            
            .hero-body {
              border-right: none;
              border-bottom: 1px solid var(--border);
              padding: 1.5rem;
            }
            
            .hero-media {
              border-radius: 0 0 var(--r-lg) var(--r-lg);
              min-height: 200px;
            }
            
            .hero-photo, .hero-photo-placeholder {
              border-radius: 0 0 var(--r-lg) var(--r-lg);
            }
            
            .features-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .meta-block { display: none; }
          }

          @media (max-width: 640px) {
            .main { padding: 1.25rem 1rem 3rem; }
            
            .page-header {
              flex-direction: column;
              align-items: flex-start;
              margin-bottom: 1.5rem;
            }
            
            .page-heading { font-size: 1.75rem; }
            .page-sub { font-size: 0.85rem; max-width: 100%; }
            
            .hero-body {
              padding: 1.25rem 1rem;
              gap: 0.85rem;
            }
            
            .hero-media {
              border-radius: 0 0 var(--r-lg) var(--r-lg);
              min-height: 0;
            }
            
            .hero-title { font-size: 1.6rem; }
            .hero-desc { max-width: 100%; }
            
            .features-grid {
              grid-template-columns: 1fr;
              gap: 0.75rem;
            }
            
            .feature-card {
              flex-direction: column;
              padding: 1rem;
              gap: 0.75rem;
            }
            
            .feature-card .card-top {
              flex-direction: row;
              align-items: flex-start;
              justify-content: space-between;
            }
            
            .feature-card > div:last-child {
              flex: 1;
              min-width: 0;
            }
            
            .card-icon { width: 40px; height: 40px; font-size: 17px; }
            .card-arrow { width: 26px; height: 26px; }
            
            .status-bar {
              padding: 0.85rem 1rem;
              flex-wrap: wrap;
              gap: 0.5rem;
            }
            
            .status-left { flex-wrap: wrap; gap: 0.6rem; }
            .status-div { display: block; }
          }

          @media (max-width: 380px) {
            .page-heading { font-size: 1.5rem; }
            .eyebrow { font-size: 0.58rem; }
            .hero-title { font-size: 1.4rem; }
          }
        `}</style>
      </div>
    </>
  );
}

export default Dashboard;