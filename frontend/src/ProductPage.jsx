import { useEffect, useState } from "react";

import API from "./api";

// Toast notification component
function Toast({ item, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="toast-wrap">
      <img src={item.image_url} className="toast-img" alt={item.name} />
      <div className="toast-info">
        <p className="toast-label">Added to cart ✓</p>
        <p className="toast-name">{item.name}</p>
      </div>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
}

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [search, setSearch] = useState("");
  

  // eslint-disable-next-line react-hooks/immutability
  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await API.get("https://dc-li58.vercel.app/products");
    setProducts(res.data);
    setLoading(false);
  };

  const addToCart = async (id) => {
    setAddingId(id);
    const user = JSON.parse(localStorage.getItem("user"));
    await API.post("https://dc-li58.vercel.app/cart/add", {
      user_id: user.user_id,
      product_id: id,
      quantity: 1
    });
    const product = products.find((p) => p.id === id);
    setToast(product);
    setAddingId(null);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

        .pp-root {
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
          background: #09090b;
        }

        /* Header */
        .pp-header {
          background: #0f0f11;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 40px 48px 32px;
        }
        .pp-header-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .pp-title-area {}
        .pp-eyebrow {
          font-size: 11px;
          font-weight: 600;
          color: #f59e0b;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .pp-title {
          font-size: 36px;
          font-weight: 800;
          color: white;
          letter-spacing: -1px;
          margin-bottom: 4px;
        }
        .pp-subtitle {
          font-size: 15px;
          color: rgba(255,255,255,0.35);
        }
        .pp-search-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .pp-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 15px;
          opacity: 0.4;
        }
        .pp-search {
          padding: 11px 16px 11px 40px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Outfit', sans-serif;
          color: white;
          outline: none;
          width: 240px;
          transition: all 0.18s;
        }
        .pp-search::placeholder { color: rgba(255,255,255,0.25); }
        .pp-search:focus {
          border-color: rgba(245,158,11,0.4);
          background: rgba(245,158,11,0.04);
        }

        /* Count bar */
        .pp-count-bar {
          max-width: 1280px;
          margin: 0 auto;
          padding: 20px 48px 0;
          font-size: 13px;
          color: rgba(255,255,255,0.3);
        }

        /* Grid */
        .pp-grid-wrap {
          max-width: 1280px;
          margin: 0 auto;
          padding: 24px 48px 60px;
        }
        .pp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }

        /* Product card */
        .p-card {
          background: #0f0f11;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
          display: flex;
          flex-direction: column;
          cursor: default;
        }
        .p-card:hover {
          transform: translateY(-6px);
          border-color: rgba(245,158,11,0.2);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,158,11,0.1);
        }
        .p-card:hover .p-img { transform: scale(1.06); }

        .p-img-wrap {
          overflow: hidden;
          background: #1a1a1d;
          position: relative;
        }
        .p-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }
        .p-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(245,158,11,0.9);
          color: #09090b;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .p-body {
          padding: 18px 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-grow: 1;
        }
        .p-name {
          font-size: 15px;
          font-weight: 600;
          color: white;
          line-height: 1.35;
        }
        .p-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .p-price {
          font-size: 22px;
          font-weight: 800;
          color: #f59e0b;
          letter-spacing: -0.5px;
        }
        .p-badge {
          font-size: 11px;
          color: #34d399;
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.2);
          padding: 2px 8px;
          border-radius: 100px;
          font-weight: 600;
        }
        .p-btn {
          width: 100%;
          padding: 11px;
          background: rgba(245,158,11,0.1);
          color: #f59e0b;
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Outfit', sans-serif;
          transition: all 0.18s;
          letter-spacing: 0.1px;
          margin-top: auto;
        }
        .p-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #f59e0b, #f97316);
          color: #09090b;
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(245,158,11,0.35);
        }
        .p-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Skeleton loading */
        .p-skeleton {
          background: #0f0f11;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
        }
        .skel-img {
          width: 100%;
          height: 200px;
          background: linear-gradient(90deg, #1a1a1d 25%, #222226 50%, #1a1a1d 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .skel-body { padding: 18px; }
        .skel-line {
          height: 14px;
          background: linear-gradient(90deg, #1a1a1d 25%, #222226 50%, #1a1a1d 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
          margin-bottom: 10px;
        }
        .skel-line.short { width: 50%; }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Empty state */
        .pp-empty {
          text-align: center;
          padding: 80px 20px;
          grid-column: 1 / -1;
        }
        .pp-empty-icon { font-size: 52px; margin-bottom: 16px; }
        .pp-empty-title { font-size: 18px; font-weight: 700; color: white; margin-bottom: 8px; }
        .pp-empty-sub { font-size: 14px; color: rgba(255,255,255,0.3); }

        /* Toast */
        .toast-wrap {
          position: fixed;
          bottom: 28px;
          right: 28px;
          background: #1a1a1d;
          border: 1px solid rgba(52,211,153,0.3);
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 9999;
          box-shadow: 0 16px 40px rgba(0,0,0,0.5);
          animation: toastIn 0.3s ease;
          max-width: 300px;
        }
        @keyframes toastIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .toast-img {
          width: 48px; height: 48px;
          object-fit: cover;
          border-radius: 8px;
          flex-shrink: 0;
        }
        .toast-info { flex: 1; }
        .toast-label {
          font-size: 12px;
          font-weight: 600;
          color: #34d399;
          margin-bottom: 2px;
          font-family: 'Outfit', sans-serif;
        }
        .toast-name {
          font-size: 13px;
          font-weight: 600;
          color: white;
          font-family: 'Outfit', sans-serif;
          line-height: 1.3;
        }
        .toast-close {
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          font-size: 12px;
          padding: 2px;
          flex-shrink: 0;
          font-family: 'Outfit', sans-serif;
        }
        .toast-close:hover { color: white; }

        .toast-cart-btn {
          display: block;
          width: 100%;
          margin-top: 8px;
          padding: 7px;
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.2);
          border-radius: 7px;
          color: #34d399;
          font-size: 12px;
          font-weight: 600;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          text-align: center;
        }
        .toast-cart-btn:hover {
          background: rgba(52,211,153,0.2);
        }
      `}</style>

      <div className="pp-root">
        {/* Header */}
        <div className="pp-header">
          <div className="pp-header-inner">
            <div className="pp-title-area">
              <p className="pp-eyebrow">✦ Curated collection</p>
              <h1 className="pp-title">Our Products</h1>
              <p className="pp-subtitle">Discover pieces you'll love</p>
            </div>
            <div className="pp-search-wrap">
              <span className="pp-search-icon">🔍</span>
              <input
                className="pp-search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {!loading && (
          <div className="pp-count-bar">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          </div>
        )}

        {/* Grid */}
        <div className="pp-grid-wrap">
          <div className="pp-grid">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="p-skeleton">
                    <div className="skel-img" />
                    <div className="skel-body">
                      <div className="skel-line" />
                      <div className="skel-line short" />
                    </div>
                  </div>
                ))
              : filtered.length === 0
              ? (
                <div className="pp-empty">
                  <div className="pp-empty-icon">🔍</div>
                  <p className="pp-empty-title">No products found</p>
                  <p className="pp-empty-sub">Try a different search term</p>
                </div>
              )
              : filtered.map((p) => (
                <div key={p.id} className="p-card">
                  <div className="p-img-wrap">
                    <img src={p.image_url} className="p-img" alt={p.name} />
                    <span className="p-tag">New</span>
                  </div>
                  <div className="p-body">
                    <h3 className="p-name">{p.name}</h3>
                    <div className="p-price-row">
                      <span className="p-price">${p.price}</span>
                      <span className="p-badge">In Stock</span>
                    </div>
                    <button
                      className="p-btn"
                      disabled={addingId === p.id}
                      onClick={() => addToCart(p.id)}
                    >
                      {addingId === p.id ? "Adding…" : "Add to Cart 🛒"}
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <Toast
            item={toast}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </>
  );
}
