import { useEffect, useRef } from "react";
import { Reveal } from "../components/Shared";
import {
  Award,
  GraduationCap,
  BadgeCheck,
  Users,
  HeartHandshake,
  Shield,
  Sparkles,
  Globe,
} from "lucide-react";

const trustPoints = [
  {
    icon: Award,
    title: "15+ Years Experience",
  },
  {
    icon: GraduationCap,
    title: "MSc in Human Development",
  },
  {
    icon: BadgeCheck,
    title: "Certified Counsellor",
  },
  {
    icon: Users,
    title: "300K+ Online Community",
  },
  {
    icon: HeartHandshake,
    title: "Compassionate & Non-Judgmental",
  },
  {
    icon: Shield,
    title: "Private & Confidential Sessions",
  },
  {
    icon: Sparkles,
    title: "Spiritual + Emotional + Practical Guidance",
  },
  {
    icon: Globe,
    title: "Global Online Consultations",
  },
];

const TrustUs = () => {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = wrap.offsetWidth;
      canvas.height = wrap.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 2 + 1,
      speed: 0.0002 + Math.random() * 0.0005,
      phase: Math.random() * Math.PI * 2,
    }));

    let animationId;

    const animate = (t) => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        const x = p.x * w;
        const y =
          (p.y + Math.sin(t * p.speed + p.phase) * 0.03) * h;

        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(201,168,76,0.25)";
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <section
        ref={wrapRef}
        id="clients"
        className="trust-section"
      >
        <canvas
          ref={canvasRef}
          className="trust-canvas"
        />

        <div className="trust-container">
          <Reveal>
            <div className="trust-header">
              <span className="trust-tag">
                WHY CLIENTS TRUST HER
              </span>

              <h2 className="trust-title">
                Why Overseas Indians
                <br />
                Trust Jyotirmay
              </h2>

              <div className="trust-line" />
            </div>
          </Reveal>

          <div className="trust-grid">
            {trustPoints.map((item, index) => {
              const Icon = item.icon;

              return (
                <Reveal key={index}>
                  <div className="trust-card">
                    <div className="trust-icon">
                      <Icon size={24} strokeWidth={1.8} />
                    </div>

                    <h3>{item.title}</h3>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .trust-section{
          position:relative;
          padding:100px 5%;
          background:#fff;
          overflow:hidden;
        }

        .trust-canvas{
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          pointer-events:none;
        }

        .trust-container{
          max-width:1200px;
          margin:auto;
          position:relative;
          z-index:1;
        }

        .trust-header{
          text-align:center;
          margin-bottom:60px;
        }

        .trust-tag{
          display:inline-block;
          padding:8px 18px;
          border-radius:999px;
          border:1px solid rgba(201,168,76,.3);
          background:rgba(201,168,76,.06);
          color:#c9a84c;
          font-size:.75rem;
          letter-spacing:2px;
          text-transform:uppercase;
          margin-bottom:20px;
        }

        .trust-title{
          color:#2d004f;
          font-size:clamp(2rem,4vw,3.2rem);
          line-height:1.2;
          margin:0;
        }

        .trust-line{
          width:80px;
          height:3px;
          border-radius:999px;
          margin:22px auto 0;
          background:linear-gradient(
            90deg,
            #c9a84c,
            #f5df9a,
            #c9a84c
          );
        }

        .trust-grid{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:24px;
        }

        .trust-card{
          background:#fff;
          border:1px solid rgba(201,168,76,.18);
          border-radius:22px;
          padding:28px 24px;
          text-align:center;
          transition:.35s ease;
          box-shadow:0 10px 30px rgba(45,0,79,.05);
        }

        .trust-card:hover{
          transform:translateY(-8px);
          border-color:rgba(201,168,76,.45);
          box-shadow:0 20px 45px rgba(45,0,79,.12);
        }

        .trust-icon{
          width:64px;
          height:64px;
          border-radius:18px;
          display:flex;
          align-items:center;
          justify-content:center;
          margin:0 auto 18px;
          color:#c9a84c;
          background:rgba(201,168,76,.08);
          border:1px solid rgba(201,168,76,.2);
        }

        .trust-card h3{
          color:#2d004f;
          font-size:1rem;
          line-height:1.6;
          font-weight:600;
          margin:0;
        }

        @media(max-width:992px){
          .trust-grid{
            grid-template-columns:repeat(2,1fr);
          }
        }

        @media(max-width:600px){
          .trust-grid{
            grid-template-columns:1fr;
          }

          .trust-section{
            padding:80px 5%;
          }
        }
      `}</style>
    </>
  );
};

export default TrustUs;