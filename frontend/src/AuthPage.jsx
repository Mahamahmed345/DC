import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import API from "./api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "", full_name: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const submit = async () => {
    setLoading(true);
    try {
      setError("");
      const payload = isLogin ? { email: form.email, password: form.password } : form;
      const url = isLogin ? "/login" : "/signup";
      const res = await API.post(url, payload);
      login(res.data);
      navigate("/products");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submit();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        
        .auth-page {
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
          display: flex;
          background: #09090b;
          overflow: hidden;
          position: relative;
        }
        
        /* Left decorative panel */
        .auth-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px;
          position: relative;
          overflow: hidden;
        }
        
        .auth-left-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 50%, rgba(245,158,11,0.15) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(239,68,68,0.1) 0%, transparent 50%);
        }
        
        .auth-left-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .auth-left-content {
          position: relative;
          z-index: 1;
          max-width: 420px;
        }
        
        .auth-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 60px;
        }
        
        .auth-brand-icon {
          width: 46px;
          height: 46px;
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          box-shadow: 0 6px 20px rgba(245,158,11,0.4);
        }
        
        .auth-brand-name {
          font-size: 22px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }
        
        .auth-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 12px;
          font-weight: 600;
          color: #f59e0b;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        
        .auth-hero-title {
          font-size: 48px;
          font-weight: 800;
          color: white;
          line-height: 1.1;
          letter-spacing: -1.5px;
          margin-bottom: 20px;
        }
        
        .auth-hero-title .accent {
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .auth-hero-desc {
          font-size: 16px;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          margin-bottom: 48px;
        }
        
        .auth-features {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .auth-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: rgba(255,255,255,0.5);
        }
        
        .auth-feature-dot {
          width: 6px;
          height: 6px;
          background: #f59e0b;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        /* Right form panel */
        .auth-right {
          width: 460px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 48px;
          background: #0f0f11;
          border-left: 1px solid rgba(255,255,255,0.06);
        }
        
        .auth-form-wrap {
          width: 100%;
          max-width: 360px;
        }
        
        .auth-form-title {
          font-size: 26px;
          font-weight: 700;
          color: white;
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }
        
        .auth-form-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 32px;
        }
        
        .auth-field {
          margin-bottom: 18px;
        }
        
        .auth-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          margin-bottom: 7px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        
        .auth-inp {
          width: 100%;
          padding: 13px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Outfit', sans-serif;
          color: white;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          box-sizing: border-box;
          display: block;
        }
        
        .auth-inp::placeholder {
          color: rgba(255,255,255,0.2);
        }
        
        .auth-inp:focus {
          border-color: rgba(245,158,11,0.5);
          background: rgba(245,158,11,0.04);
          box-shadow: 0 0 0 3px rgba(245,158,11,0.08);
        }
        
        .auth-error {
          padding: 11px 14px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          color: #f87171;
          font-size: 13px;
          margin-bottom: 16px;
          font-weight: 500;
        }
        
        .auth-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #f59e0b, #f97316);
          color: #09090b;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          letter-spacing: 0.2px;
          transition: all 0.18s;
          margin-top: 4px;
          box-shadow: 0 4px 16px rgba(245,158,11,0.3);
        }
        
        .auth-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(245,158,11,0.4);
        }
        
        .auth-submit:active {
          transform: translateY(0);
        }
        
        .auth-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }
        
        .auth-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }
        
        .auth-divider-text {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          font-weight: 500;
        }
        
        .auth-toggle {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          text-align: center;
        }
        
        .auth-toggle-link {
          color: #f59e0b;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.15s;
        }
        
        .auth-toggle-link:hover {
          color: #fbbf24;
        }
        
        @media (max-width: 768px) {
          .auth-left { display: none; }
          .auth-right { width: 100%; border-left: none; padding: 40px 28px; }
        }
      `}</style>

      <div className="auth-page">
        {/* Left decorative panel */}
        <div className="auth-left">
          <div className="auth-left-bg" />
          <div className="auth-left-grid" />
          <div className="auth-left-content">
            <div className="auth-brand">
              <div className="auth-brand-icon">🛍️</div>
              <span className="auth-brand-name">ShopEasy</span>
            </div>

            <div className="auth-hero-badge">✦ New arrivals every week</div>

            <h1 className="auth-hero-title">
              Shop smarter,<br />
              <span className="accent">live better.</span>
            </h1>

            <p className="auth-hero-desc">
              Discover thousands of products curated just for you. Fast delivery, easy returns, and unbeatable prices.
            </p>

            <div className="auth-features">
              {["Free shipping on orders over $50", "30-day hassle-free returns", "Secure payment processing", "24/7 customer support"].map(f => (
                <div key={f} className="auth-feature">
                  <div className="auth-feature-dot" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            <h2 className="auth-form-title">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="auth-form-sub">
              {isLogin ? "Sign in to continue your shopping" : "Join ShopEasy and start shopping"}
            </p>

            {!isLogin && (
              <div className="auth-field">
                <label className="auth-label">Full Name</label>
                <input
                  name="full_name"
                  placeholder="John Doe"
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="auth-inp"
                />
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="auth-inp"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="auth-inp"
              />
            </div>

            {error && <div className="auth-error">⚠ {error}</div>}

            <button className="auth-submit" onClick={submit} disabled={loading}>
              {loading ? "Please wait…" : isLogin ? "Sign In →" : "Create Account →"}
            </button>

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">or</span>
              <div className="auth-divider-line" />
            </div>

            <p className="auth-toggle">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span
                className="auth-toggle-link"
                onClick={() => { setIsLogin(!isLogin); setError(""); }}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
