import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import API from "./api";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    if (user) fetchCartCount();
  }, [user, location.pathname]);

  const fetchCartCount = async () => {
    try {
      const res = await API.get(`https://dc-li58.vercel.app/cart/${user.user_id}`);
      const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        .nav-root {
          font-family: 'Outfit', sans-serif;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
          height: 68px;
          background: #09090b;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky;
          top: 0;
          z-index: 100;
          flex-shrink: 0;
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .nav-brand-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
        }
        .nav-brand-name {
          font-size: 19px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.4px;
        }
        .nav-brand-name span {
          color: #f59e0b;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-link-item {
          color: rgba(255,255,255,0.55);
          padding: 7px 16px;
          text-decoration: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.18s;
          font-family: 'Outfit', sans-serif;
        }
        .nav-link-item:hover, .nav-link-item.active {
          color: white;
          background: rgba(255,255,255,0.07);
        }
        .nav-cart-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 7px;
          color: white;
          padding: 7px 16px;
          text-decoration: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.2);
          transition: all 0.18s;
          font-family: 'Outfit', sans-serif;
        }
        .nav-cart-link:hover {
          background: rgba(245, 158, 11, 0.2);
          border-color: rgba(245, 158, 11, 0.4);
        }
        .cart-badge {
          background: #f59e0b;
          color: #09090b;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
          padding: 1px 7px;
          min-width: 20px;
          text-align: center;
        }
        .nav-logout-btn {
          margin-left: 8px;
          padding: 7px 18px;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          border-radius: 8px;
          color: rgba(255,255,255,0.6);
          background: transparent;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.18s;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.1px;
        }
        .nav-logout-btn:hover {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.3);
          color: #ef4444;
        }
        .nav-user-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px 4px 4px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 100px;
          margin-right: 4px;
        }
        .nav-avatar {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: white;
        }
        .nav-username {
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          font-weight: 500;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
      <nav className="nav-root">
        <Link to="/products" className="nav-brand">
          <div className="nav-brand-icon">🛍️</div>
          <span className="nav-brand-name">Shop<span>Easy</span></span>
        </Link>

        <div className="nav-links">
          <Link
            className={`nav-link-item ${isActive("/products") ? "active" : ""}`}
            to="/products"
          >
            Products
          </Link>

          <Link className="nav-cart-link" to="/cart">
            🛒 Cart
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>

          <div className="nav-user-chip">
            <div className="nav-avatar">
              {(user.full_name || user.email || "U")[0].toUpperCase()}
            </div>
            <span className="nav-username">
              {user.full_name || user.email?.split("@")[0] || "User"}
            </span>
          </div>

          <button className="nav-logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </nav>
    </>
  );
}
