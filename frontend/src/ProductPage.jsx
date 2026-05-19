import { useEffect, useState } from "react";
import API from "./api";

export default function ProductPage() {
  const [products, setProducts] = useState([]);

  // 🛒 cart drawer state
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItem, setCartItem] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await API.get("http://localhost:5001/products");
    setProducts(res.data);
  };

  // 🛒 Add to cart + open sidebar
  const addToCart = async (id) => {
    const user = JSON.parse(localStorage.getItem("user"));

    await API.post("http://localhost:5001/cart/add", {
      user_id: user.user_id,
      product_id: id,
      quantity: 1
    });

    const product = products.find((p) => p.id === id);

    setCartItem(product);
    setCartOpen(true);
  };

  return (
    <div style={styles.container}>
      <h2>🛍️ Products</h2>

      {/* PRODUCT GRID */}
      <div style={styles.grid}>
        {products.map((p) => (
          <div key={p.id} style={styles.card}>
            <img src={p.image_url} style={styles.img} />
            <h3>{p.name}</h3>
            <p>${p.price}</p>

            <button
              onClick={() => addToCart(p.id)}
              style={styles.button}
            >
              Add to Cart 🛒
            </button>
          </div>
        ))}
      </div>

      {/* 🛒 SLIDING CART SIDEBAR */}
      {cartOpen && (
        <div style={styles.overlay}>
          <div style={styles.sidebar}>
            <h3>🛒 Added to Cart</h3>

            {cartItem && (
              <div style={styles.item}>
                <img src={cartItem.image_url} style={styles.sideImg} />
                <h4>{cartItem.name}</h4>
                <p>${cartItem.price}</p>
              </div>
            )}

            <button
              style={styles.goBtn}
              onClick={() => (window.location.href = "/cart")}
            >
              Go to Cart →
            </button>

            <button
              style={styles.closeBtn}
              onClick={() => setCartOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  container: {
    padding: 20,
    fontFamily: "Arial"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20
  },

  card: {
    padding: 15,
    border: "1px solid #ddd",
    borderRadius: 10,
    textAlign: "center",
    background: "white"
  },

  img: {
    width: "100%",
    height: 120,
    objectFit: "cover",
    borderRadius: 8
  },

  button: {
    marginTop: 10,
    padding: 10,
    width: "100%",
    background: "#111827",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: 5
  },

  /* 🛒 CART OVERLAY */
  overlay: {
    position: "fixed",
    top: 0,
    right: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 999
  },

  sidebar: {
    width: "320px",
    background: "white",
    height: "100%",
    padding: 20,
    animation: "slideIn 0.3s ease-in-out"
  },

  item: {
    marginTop: 20,
    textAlign: "center"
  },

  sideImg: {
    width: "100%",
    height: 120,
    objectFit: "cover",
    borderRadius: 8
  },

  goBtn: {
    marginTop: 20,
    padding: 10,
    width: "100%",
    background: "green",
    color: "white",
    border: "none",
    cursor: "pointer"
  },

  closeBtn: {
    marginTop: 10,
    padding: 10,
    width: "100%",
    background: "#ef4444",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};