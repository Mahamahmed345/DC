import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [processingId, setProcessingId] = useState(null);
  const [orderDone, setOrderDone] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const navigate = useNavigate();

  const [card, setCard] = useState({
    card_number: "",
    expiry: "",
    cvv: "",
    name: ""
  });

  // eslint-disable-next-line react-hooks/immutability
  useEffect(() => { loadCart(); }, []);

  const loadCart = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await API.get(`https://dc-li58.vercel.app/cart/${user.user_id}`);
    setCart(res.data);
    setLoading(false);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const updateQty = async (item, type) => {
    let newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;
    if (newQty < 1) return;
    setProcessingId(item.product_id);
    await API.put("https://dc-li58.vercel.app/cart/update", {
      user_id: item.user_id,
      product_id: item.product_id,
      quantity: newQty
    });
    await loadCart();
    setProcessingId(null);
  };

  const removeItem = async (item) => {
    setProcessingId(item.product_id);
    await API.delete("https://dc-li58.vercel.app/cart/remove", {
      data: { user_id: item.user_id, product_id: item.product_id }
    });
    await loadCart();
    setProcessingId(null);
  };

  const checkout = async () => {
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const order = await API.post("https://dc-zmrn.vercel.app/order/create", {
        user_id: user.user_id
      });

      const payment = await API.post("https://dc-u3lh.vercel.app/pay", {
        user_id: user.user_id,
        order_id: order.data.order_id,
        amount: total,
        payment_method: paymentMethod,
        card_number: card.card_number
      });

      await API.delete(`https://dc-li58.vercel.app/cart/clear/${user.user_id}`);
      setCart([]);
      setShowCheckout(false);

      if (payment.data.status === "success" || paymentMethod === "cod") {
        setOrderDone(true);
      } else {
        setCheckoutError("Payment was declined. Please check your card details and try again.");
      }
    } catch (err) {
      setCheckoutError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (orderDone) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
          .success-page {
            font-family: 'Outfit', sans-serif;
            min-height: 100vh;
            background: #09090b;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            text-align: center;
            padding: 40px;
          }
          .success-ring {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: rgba(52,211,153,0.1);
            border: 2px solid rgba(52,211,153,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 44px;
            margin: 0 auto 28px;
            animation: popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275);
          }
          @keyframes popIn {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .success-title { font-size: 32px; font-weight: 800; color: white; margin-bottom: 8px; letter-spacing: -0.5px; }
          .success-sub { font-size: 16px; color: rgba(255,255,255,0.4); margin-bottom: 36px; }
          .success-btn {
            padding: 14px 32px;
            background: linear-gradient(135deg, #f59e0b, #f97316);
            color: #09090b;
            border: none;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 700;
            font-family: 'Outfit', sans-serif;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(245,158,11,0.3);
          }
        `}</style>
        <div className="success-page">
          <div className="success-ring">✓</div>
          <h2 className="success-title">Order Placed!</h2>
          <p className="success-sub">
            {paymentMethod === "cod"
              ? "Your order will be delivered soon. Pay on delivery."
              : "Payment successful. Your order is confirmed."}
          </p>
          <button className="success-btn" onClick={() => navigate("/products")}>
            Continue Shopping →
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

        .cart-root {
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
          background: #09090b;
          padding-bottom: 60px;
        }

        /* Header */
        .cart-header {
          background: #0f0f11;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 36px 48px 28px;
        }
        .cart-header-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .cart-eyebrow {
          font-size: 11px;
          font-weight: 600;
          color: #f59e0b;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .cart-title {
          font-size: 32px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.8px;
          margin-bottom: 4px;
        }
        .cart-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.35);
        }

        /* Body */
        .cart-body {
          max-width: 1100px;
          margin: 0 auto;
          padding: 32px 48px;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 24px;
          align-items: start;
        }

        /* Items */
        .cart-items { display: flex; flex-direction: column; gap: 12px; }

        .cart-card {
          background: #0f0f11;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: border-color 0.2s;
        }
        .cart-card:hover { border-color: rgba(255,255,255,0.1); }

        .cart-card-img {
          width: 88px;
          height: 88px;
          object-fit: cover;
          border-radius: 12px;
          flex-shrink: 0;
          background: #1a1a1d;
        }

        .cart-card-info { flex: 1; min-width: 0; }
        .cart-card-name {
          font-size: 15px;
          font-weight: 600;
          color: white;
          margin-bottom: 4px;
          line-height: 1.35;
        }
        .cart-card-price {
          font-size: 18px;
          font-weight: 800;
          color: #f59e0b;
          letter-spacing: -0.3px;
          margin-bottom: 12px;
        }
        .cart-card-subtotal {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          margin-top: 2px;
        }

        .cart-card-controls {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
          flex-shrink: 0;
        }

        .qty-control {
          display: flex;
          align-items: center;
          gap: 0;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          overflow: hidden;
        }
        .qty-btn-dark {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          font-size: 16px;
          transition: all 0.15s;
          font-family: 'Outfit', sans-serif;
        }
        .qty-btn-dark:hover:not(:disabled) {
          background: rgba(255,255,255,0.07);
          color: white;
        }
        .qty-btn-dark:disabled { opacity: 0.3; cursor: not-allowed; }
        .qty-num {
          font-size: 14px;
          font-weight: 700;
          color: white;
          min-width: 28px;
          text-align: center;
          padding: 0 2px;
        }

        .remove-dark {
          background: none;
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 6px;
          color: rgba(239,68,68,0.6);
          font-size: 12px;
          font-weight: 600;
          padding: 5px 12px;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          transition: all 0.15s;
        }
        .remove-dark:hover {
          background: rgba(239,68,68,0.08);
          border-color: rgba(239,68,68,0.4);
          color: #f87171;
        }

        /* Summary panel */
        .cart-summary {
          background: #0f0f11;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 28px;
          position: sticky;
          top: 88px;
        }
        .summary-title {
          font-size: 16px;
          font-weight: 700;
          color: white;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .summary-lbl { font-size: 14px; color: rgba(255,255,255,0.4); }
        .summary-val { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.7); }
        .summary-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 16px 0; }
        .summary-total-lbl { font-size: 16px; font-weight: 700; color: white; }
        .summary-total-val { font-size: 28px; font-weight: 800; color: #f59e0b; letter-spacing: -0.8px; }

        .checkout-dark {
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
          letter-spacing: 0.1px;
          margin-top: 20px;
          transition: all 0.18s;
          box-shadow: 0 4px 16px rgba(245,158,11,0.25);
        }
        .checkout-dark:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(245,158,11,0.35);
        }

        .continue-btn {
          width: 100%;
          padding: 11px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          margin-top: 10px;
          transition: all 0.15s;
          font-weight: 500;
        }
        .continue-btn:hover {
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.6);
        }

        .trust-badges {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(255,255,255,0.3);
        }

        /* Empty state */
        .cart-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 20px;
        }
        .cart-empty-icon { font-size: 60px; margin-bottom: 20px; }
        .cart-empty-title { font-size: 22px; font-weight: 700; color: white; margin-bottom: 8px; letter-spacing: -0.3px; }
        .cart-empty-sub { font-size: 15px; color: rgba(255,255,255,0.3); margin-bottom: 28px; }
        .shop-now-btn {
          padding: 13px 28px;
          background: linear-gradient(135deg, #f59e0b, #f97316);
          color: #09090b;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(245,158,11,0.3);
        }

        /* Checkout modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          backdrop-filter: blur(4px);
        }
        .modal-box {
          background: #0f0f11;
          border: 1px solid rgba(255,255,255,0.08);
          width: 90%;
          max-width: 460px;
          border-radius: 20px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 32px 64px rgba(0,0,0,0.5);
          animation: modalPop 0.25s ease;
        }
        @keyframes modalPop {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .modal-head {
          padding: 28px 28px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .modal-head-title {
          font-size: 20px;
          font-weight: 800;
          color: white;
          margin-bottom: 4px;
          letter-spacing: -0.3px;
        }
        .modal-head-total {
          font-size: 32px;
          font-weight: 800;
          color: #f59e0b;
          letter-spacing: -1px;
        }
        .modal-body { padding: 24px 28px 28px; }
        .modal-field-lbl {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 7px;
        }
        .modal-sel {
          width: 100%;
          padding: 12px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Outfit', sans-serif;
          color: white;
          outline: none;
          box-sizing: border-box;
          cursor: pointer;
        }
        .modal-sel option { background: #1a1a1d; }
        .modal-inp {
          width: 100%;
          padding: 12px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Outfit', sans-serif;
          color: white;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          box-sizing: border-box;
          display: block;
          margin-top: 7px;
        }
        .modal-inp::placeholder { color: rgba(255,255,255,0.2); }
        .modal-inp:focus {
          border-color: rgba(245,158,11,0.4);
          box-shadow: 0 0 0 3px rgba(245,158,11,0.07);
        }
        .modal-card-form { margin-top: 20px; display: flex; flex-direction: column; gap: 14px; }
        .modal-row { display: flex; gap: 12px; }
        .modal-row > div { flex: 1; }

        .place-order-btn {
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
          margin-top: 24px;
          box-shadow: 0 4px 16px rgba(245,158,11,0.3);
          transition: all 0.18s;
        }
        .place-order-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(245,158,11,0.4);
        }
        .cancel-dark {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: rgba(255,255,255,0.35);
          font-size: 13px;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          margin-top: 10px;
          transition: all 0.15s;
        }
        .cancel-dark:hover { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.6); }

        /* Skeleton */
        .skel-card {
          background: #0f0f11;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          gap: 16px;
        }
        .skel-sq {
          width: 88px; height: 88px; border-radius: 12px; flex-shrink: 0;
          background: linear-gradient(90deg, #1a1a1d 25%, #222226 50%, #1a1a1d 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .skel-lines { flex: 1; display: flex; flex-direction: column; gap: 10px; padding-top: 4px; }
        .skel-l {
          height: 13px; border-radius: 6px;
          background: linear-gradient(90deg, #1a1a1d 25%, #222226 50%, #1a1a1d 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        @media (max-width: 768px) {
          .cart-body { grid-template-columns: 1fr; padding: 20px; }
          .cart-header { padding: 28px 20px 20px; }
          .cart-summary { position: static; }
        }
      `}</style>

      <div className="cart-root">
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-inner">
            <p className="cart-eyebrow">✦ Your cart</p>
            <h1 className="cart-title">Shopping Cart</h1>
            <p className="cart-subtitle">
              {loading ? "Loading…" : `${itemCount} item${itemCount !== 1 ? "s" : ""} in your cart`}
            </p>
          </div>
        </div>

        <div className="cart-body">
          {/* Left: items */}
          <div className="cart-items">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skel-card">
                    <div className="skel-sq" />
                    <div className="skel-lines">
                      <div className="skel-l" style={{ width: "70%" }} />
                      <div className="skel-l" style={{ width: "35%" }} />
                      <div className="skel-l" style={{ width: "50%" }} />
                    </div>
                  </div>
                ))
              : cart.length === 0
              ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon">🛒</div>
                  <h3 className="cart-empty-title">Your cart is empty</h3>
                  <p className="cart-empty-sub">Add some products to get started</p>
                  <button className="shop-now-btn" onClick={() => navigate("/products")}>
                    Browse Products →
                  </button>
                </div>
              )
              : cart.map((item) => (
                <div key={item.product_id} className="cart-card">
                  <img src={item.image_url} className="cart-card-img" alt={item.name} />
                  <div className="cart-card-info">
                    <p className="cart-card-name">{item.name}</p>
                    <p className="cart-card-price">
                      ${item.price}
                      <span className="cart-card-subtotal"> × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="cart-card-controls">
                    <div className="qty-control">
                      <button
                        className="qty-btn-dark"
                        disabled={processingId === item.product_id || item.quantity <= 1}
                        onClick={() => updateQty(item, "dec")}
                      >−</button>
                      <span className="qty-num">{item.quantity}</span>
                      <button
                        className="qty-btn-dark"
                        disabled={processingId === item.product_id}
                        onClick={() => updateQty(item, "inc")}
                      >+</button>
                    </div>
                    <button
                      className="remove-dark"
                      disabled={processingId === item.product_id}
                      onClick={() => removeItem(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Right: summary */}
          {!loading && cart.length > 0 && (
            <div className="cart-summary">
              <p className="summary-title">Order Summary</p>

              <div className="summary-row">
                <span className="summary-lbl">Subtotal ({itemCount} items)</span>
                <span className="summary-val">${total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-lbl">Shipping</span>
                <span className="summary-val" style={{ color: "#34d399" }}>Free</span>
              </div>
              <div className="summary-row">
                <span className="summary-lbl">Tax</span>
                <span className="summary-val">$0.00</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row">
                <span className="summary-total-lbl">Total</span>
                <span className="summary-total-val">${total.toFixed(2)}</span>
              </div>

              <button className="checkout-dark" onClick={() => setShowCheckout(true)}>
                Checkout 💳
              </button>
              <button className="continue-btn" onClick={() => navigate("/products")}>
                ← Continue Shopping
              </button>

              <div className="trust-badges">
                <div className="trust-item">🔒 Secure checkout</div>
                <div className="trust-item">🚚 Free shipping included</div>
                <div className="trust-item">↩️ 30-day returns</div>
              </div>
            </div>
          )}
        </div>

        {/* Checkout modal */}
        {showCheckout && (
          <div className="modal-overlay">
            <div className="modal-box">
              <div className="modal-head">
                <p className="modal-head-title">Complete your order</p>
                <p className="modal-head-total">${total.toFixed(2)}</p>
              </div>
              <div className="modal-body">
                <label className="modal-field-lbl">Payment Method</label>
                <select
                  className="modal-sel"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="cod">📦 Cash on Delivery</option>
                  <option value="card">💳 Credit / Debit Card</option>
                </select>

                {paymentMethod === "card" && (
                  <div className="modal-card-form">
                    <div>
                      <label className="modal-field-lbl">Card Holder Name</label>
                      <input
                        className="modal-inp"
                        placeholder="John Doe"
                        onChange={(e) => setCard({ ...card, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="modal-field-lbl">Card Number</label>
                      <input
                        className="modal-inp"
                        placeholder="1234 5678 9012 3456"
                        onChange={(e) => setCard({ ...card, card_number: e.target.value })}
                      />
                    </div>
                    <div className="modal-row">
                      <div>
                        <label className="modal-field-lbl">Expiry</label>
                        <input
                          className="modal-inp"
                          placeholder="MM/YY"
                          onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="modal-field-lbl">CVV</label>
                        <input
                          className="modal-inp"
                          placeholder="•••"
                          onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {checkoutError && (
                  <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#f87171", fontSize: 13, fontWeight: 500 }}>
                    {checkoutError}
                  </div>
                )}

                <button className="place-order-btn" onClick={checkout} disabled={checkoutLoading} style={{ opacity: checkoutLoading ? 0.7 : 1, cursor: checkoutLoading ? "not-allowed" : "pointer" }}>
                  {checkoutLoading ? "Processing…" : "Place Order →"}
                </button>
                <button className="cancel-dark" onClick={() => setShowCheckout(false)} disabled={checkoutLoading}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}