import { Routes, Route } from "react-router-dom";
import AuthPage from "./AuthPage";
import ProductPage from "./ProductPage";
import CartPage from "./CartPage";
import Navbar from "./Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </>
  );
}

export default App;