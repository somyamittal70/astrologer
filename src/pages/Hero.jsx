import { useEffect, useRef, useState } from "react";
import bannerDesktop from "/banner.png";

const Hero = ({ onBookNow }) => {
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const btnsRef = useRef(null);
  const statsRef = useRef(null);
  const canvasRef = useRef(null);

  const getView = () => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    if (w <= 480) return "mobile";
    if (w <= 900) return "tablet";
    return "desktop";
  };

  const [view, setView] = useState(getView);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handleResize = () => setView(getView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = view === "mobile";
  const isTablet = view === "tablet";
  const isDesktop = view === "desktop";

  // Fade-up entrance animation
  useEffect(() => {
    const els = [badgeRef, titleRef, subRef, btnsRef, statsRef];
    els.forEach((r, i) => {
      if (r.current) {
        r.current.style.animation = `heroFadeUp 0.9s ${i * 0.16}s cubic-bezier(.22,1,.36,1) both`;
      }
    });
  }, []);

  // Canvas stars + orbs + shooting stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 130 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.5 + 0.3,
      gold: Math.random() > 0.8,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.2,
      drift: (Math.random() - 0.5) * 0.00008,
      driftY: (Math.random() - 0.5) * 0.00004,
    }));

    const orbs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      baseR: 50 + Math.random() * 90,
      phase: Math.random() * Math.PI * 2,
      gold: i < 3,
    }));

    const newShoot = () => ({
      x: Math.random(),
      y: Math.random() * 0.5,
      len: 0.06 + Math.random() * 0.1,
      angle: Math.PI / 5 + (Math.random() - 0.5) * 0.4,
      speed: 0.0015 + Math.random() * 0.002,
      prog: Math.random(),
      timer: 0,
      delay: Math.random() * 400,
    });
    const shoots = Array.from({ length: 3 }, newShoot);
    const mandalaAngles = Array.from(
      { length: 12 },
      (_, i) => (i / 12) * Math.PI * 2,
    );

    let animId;
    const animate = (t) => {
      const w = canvas.width,
        h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      orbs.forEach((o) => {
        const x = (o.x + Math.sin(t * 0.0003 + o.phase) * 0.08) * w;
        const y = (o.y + Math.cos(t * 0.0002 + o.phase * 1.3) * 0.06) * h;
        const r = o.baseR * (0.9 + 0.1 * Math.sin(t * 0.001 + o.phase));
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(
          0,
          o.gold ? "rgba(201,168,76,0.15)" : "rgba(120,90,220,0.13)",
        );
        g.addColorStop(1, o.gold ? "rgba(201,168,76,0)" : "rgba(80,60,180,0)");
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      const cx = w * 0.5,
        cy = h * 0.5;
      const ringR = Math.min(w, h) * 0.38;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.00008);
      ctx.strokeStyle = "rgba(201,168,76,0.08)";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.arc(0, 0, ringR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, ringR * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      mandalaAngles.forEach((a) => {
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * ringR * 0.72, Math.sin(a) * ringR * 0.72);
        ctx.lineTo(Math.cos(a) * ringR, Math.sin(a) * ringR);
        ctx.stroke();
      });
      ctx.restore();

      stars.forEach((s) => {
        const twinkle =
          0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.speed * 0.001 + s.phase));
        const px = (((s.x + s.drift * t) % 1) + 1) % 1;
        const py = (((s.y + s.driftY * t) % 1) + 1) % 1;
        ctx.beginPath();
        ctx.arc(px * w, py * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold
          ? `rgba(201,168,76,${twinkle * 0.9})`
          : `rgba(255,255,255,${twinkle * 0.85})`;
        ctx.fill();
        if (s.r > 1.1 && twinkle > 0.7) {
          ctx.beginPath();
          ctx.moveTo(px * w, py * h - s.r * 3);
          ctx.lineTo(px * w, py * h + s.r * 3);
          ctx.moveTo(px * w - s.r * 3, py * h);
          ctx.lineTo(px * w + s.r * 3, py * h);
          ctx.strokeStyle = s.gold
            ? `rgba(201,168,76,${(twinkle - 0.7) * 0.6})`
            : `rgba(255,255,255,${(twinkle - 0.7) * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      shoots.forEach((s) => {
        s.timer++;
        if (s.timer < s.delay) return;
        s.prog += s.speed;
        if (s.prog > 1.3) {
          Object.assign(s, newShoot());
          s.timer = 0;
          return;
        }
        const fade =
          s.prog < 0.1 ? s.prog / 0.1 : s.prog > 0.8 ? (1 - s.prog) / 0.2 : 1;
        const tx = s.x + Math.cos(s.angle) * s.prog * 0.35;
        const ty = s.y + Math.sin(s.angle) * s.prog * 0.25;
        const tx2 = tx - Math.cos(s.angle) * s.len;
        const ty2 = ty - Math.sin(s.angle) * s.len;
        const g = ctx.createLinearGradient(tx2 * w, ty2 * h, tx * w, ty * h);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(0.6, `rgba(247,215,120,${fade * 0.7})`);
        g.addColorStop(1, `rgba(255,255,255,${fade * 0.9})`);
        ctx.beginPath();
        ctx.moveTo(tx2 * w, ty2 * h);
        ctx.lineTo(tx * w, ty * h);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Font sizes
  const fs = {
    h1: isMobile ? "18px" : isTablet ? "28px" : "52px",
    sub: isMobile ? "10px" : isTablet ? "15px" : "17px",
    btn: isMobile ? "13px" : isTablet ? "14px" : "15px",
    statNum: isMobile ? "1.5rem" : isTablet ? "1.8rem" : "2.2rem",
    statLbl: isMobile ? "0.6rem" : "0.65rem",
  };

  // Spacing
  const pad = isMobile
    ? "80px 22px 60px"
    : isTablet
      ? "90px 40px 70px"
      : "0 6% 0";

  const stats = [
    { num: "300K+", label: "Global Community\nInstagram & YouTube" },
    { num: "15+", label: "Years of\nExperience" },
    { num: "20K", label: "Private Online\nSessions Worldwide" },
  ];

  return (
    <>
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes goldShine {
          from { background-position: 0% center; }
          to   { background-position: 200% center; }
        }
        .shimmer-gold {
          background: linear-gradient(90deg, #e8cc7a 10%, #fffbe6 48%, #c9a84c 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: goldShine 4s linear infinite;
        }
        .stat-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.14);
        }
        .btn-primary {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(201,168,76,0.55) !important;
        }
        .btn-secondary {
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.12) !important;
          border-color: rgba(201,168,76,0.55) !important;
        }
        .divider-dot::before {
          content: "✦";
          color: #c9a84c;
          font-size: 11px;
          margin-right: 8px;
          opacity: 0.7;
        }
      `}</style>

      <section
        id="home"
        style={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${bannerDesktop})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: isDesktop ? "contain" : "cover",
          backgroundPosition: "center center",
        }}
      >
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Gold radial glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
            background:
              "radial-gradient(ellipse 55% 55% at 28% 55%, rgba(201,168,76,0.09) 0%, transparent 70%)",
          }}
        />

        {/* ── CONTENT ── */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: isDesktop ? 1320 : "100%",
            padding: pad,
            display: "flex",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <div style={{ width: "100%", maxWidth: isDesktop ? 620 : "100%" }}>
            {/* H1 */}
            <h1
              ref={titleRef}
              style={{
                fontSize: "50px",
                color: "#4b267c",
                lineHeight: isDesktop ? 1.06 : 1.25,
                margin: isMobile
                  ? "0 0 16px"
                  : isTablet
                    ? "0 0 18px"
                    : "0 0 22px",
                fontWeight: 700,
                marginTop: "25px",
                letterSpacing: isDesktop ? "-0.5px" : "0",
              }}
            >
              <br />
              Indians Find{" "}
              <span
                style={{
                  color: "#4b267c",
                }}
              >
                Clarity
              </span>{" "}
              &amp; <br />
              <span
                style={{
                  color: "#4b267c",
                }}
              >
                Emotional Balance
              </span>
            </h1>

            {/* Subtitle */}
            <p
              ref={subRef}
              style={{
                fontSize: "15px",
                color: "rgba(97, 95, 100, 0.9)",
                maxWidth: isDesktop ? 510 : "100%",
                marginBottom: isMobile ? "10px" : isTablet ? "28px" : "35px",
                lineHeight: 1.85,
              }}
            >
              Trusted Tarot Expert, Relationship Coach &amp; Certified
              Counsellor with{" "}
              <strong style={{ color: "#4b267c", fontWeight: 600 }}>
                15+ Years
              </strong>{" "}
              of Global Experience — helping people navigate Love, Career,
              Emotional Stress &amp; Spiritual Growth.
            </p>

            {/* Buttons */}
            <div
              ref={btnsRef}
              style={{
                display: "flex",
                flexDirection: isDesktop ? "row" : "column",
                gap: isDesktop ? "12px" : "10px",
                marginBottom: isMobile ? "30px" : isTablet ? "34px" : "40px",
                maxWidth: isDesktop ? 480 : isTablet ? 280 : "100%",
              }}
            >
              <a
                href="#booknow"
                className="btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  onBookNow();
                }}
                style={{
                  background:
                    "linear-gradient(135deg, #c9a84c 0%, #e8cc7a 50%, #c9a84c 100%)",
                  backgroundSize: "200% auto",
                  color: "#2a0050",
                  padding: isMobile ? "14px 18px" : "15px 32px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: fs.btn,
                  textDecoration: "none",
                  textAlign: "center",
                  display: "block",
                  boxShadow: "0 6px 24px rgba(201,168,76,0.4)",
                  letterSpacing: "0.3px",
                }}
              >
                ✦ Book Your Clarity Session
              </a>
              <a
                href="https://wa.me/918750803540"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  background:
                    "linear-gradient(135deg, #c9a84c 0%, #e8cc7a 50%, #c9a84c 100%)",
                  backgroundSize: "200% auto",
                  color: "#2a0050",
                  padding: isMobile ? "14px 18px" : "15px 32px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: fs.btn,
                  textDecoration: "none",
                  textAlign: "center",
                  display: "block",
                  boxShadow: "0 6px 24px rgba(201,168,76,0.4)",
                  letterSpacing: "0.3px",
                }}
              >
                Chat on WhatsApp
              </a>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)",
                gap: isMobile ? "12px" : "14px",
                maxWidth: isDesktop ? 500 : "100%",
              }}
            >
              {stats.map(({ num, label }, i) => (
                <div
                  key={i}
                  className="stat-card"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid #c9bed7",
                    borderRadius: "16px",
                    padding: isMobile ? "16px 14px" : "20px 18px",
                    backdropFilter: "blur(12px)",
                    // last card full-width on mobile (odd one out)
                    ...(isMobile && i === 2 ? { gridColumn: "1 / -1" } : {}),
                  }}
                >
                  <div
                    style={{
                      fontSize: fs.statNum,
                      color: "#4b267c",
                      fontWeight: 800,
                      lineHeight: 1,
                      marginBottom: "8px",
                      textShadow: "0 2px 14px rgba(201,168,76,0.4)",
                    }}
                  >
                    {num}
                  </div>
                  <div
                    style={{
                      fontSize: fs.statLbl,
                      color: "#4b267c",
                      letterSpacing: "0.8px",
                      textTransform: "uppercase",
                      lineHeight: 1.6,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
