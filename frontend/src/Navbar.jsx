import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div style={styles.nav}>
      <h2 style={{ color: "white" }}>🛍️ ShopEasy</h2>

      <div>
        <Link style={styles.link} to="/products">
          Products
        </Link>

        <Link style={styles.link} to="/cart">
          Cart 🛒
        </Link>

        <button style={styles.btn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 25px",
    background: "#111827",
    alignItems: "center"
  },

  link: {
    color: "white",
    marginLeft: 15,
    textDecoration: "none"
  },

  btn: {
    marginLeft: 15,
    padding: "6px 12px",
    border: "none",
    cursor: "pointer"
  }
};