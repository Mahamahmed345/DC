// import { useEffect, useState } from "react";
// import API from "./api";

// export default function CartPage() {
//   const [cart, setCart] = useState([]);
//   const [showCheckout, setShowCheckout] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState("cod");

//   const [card, setCard] = useState({
//     card_number: "",
//     expiry: "",
//     cvv: "",
//     name: ""
//   });

//   useEffect(() => {
//     loadCart();
//   }, []);

//   const loadCart = async () => {
//     const user = JSON.parse(localStorage.getItem("user"));

//     const res = await API.get(
//       `https://dc-li58.vercel.app/cart/${user.user_id}`
//     );

//     setCart(res.data);
//   };

//   const total = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   // ➕ / ➖ quantity update (based on product_id)
//   const updateQty = async (item, type) => {
//     let newQty =
//       type === "inc" ? item.quantity + 1 : item.quantity - 1;

//     if (newQty < 1) return;

//     await API.put("https://dc-li58.vercel.app/cart/update", {
//       user_id: item.user_id,
//       product_id: item.product_id,
//       quantity: newQty
//     });

//     loadCart();
//   };

//   // ❌ REMOVE ITEM (IMPORTANT: using product_id + user_id)
//   const removeItem = async (item) => {
//     await API.delete("https://dc-li58.vercel.app/cart/remove", {
//       data: {
//         user_id: item.user_id,
//         product_id: item.product_id
//       }
//     });

//     loadCart();
//   };

//   const checkout = async () => {
//     const user = JSON.parse(localStorage.getItem("user"));

//     const order = await API.post(
//       "https://dc-zmrn.vercel.app/order/create",
//       { user_id: user.user_id }
//     );

//     const payment = await API.post(
//       "https://dc-u3lh.vercel.app/pay",
//       {
//         user_id: user.user_id,
//         order_id: order.data.order_id,
//         amount: total,
//         payment_method: paymentMethod,
//         card_number: card.card_number
//       }
//     );

//     await API.delete(
//       `https://dc-li58.vercel.app/cart/clear/${user.user_id}`
//     );

//     setCart([]);
//     setShowCheckout(false);

//     if (payment.data.status === "success") {
//       alert("✅ Payment Successful");
//     } else if (paymentMethod === "cod") {
//       alert("📦 Order placed (COD)");
//     } else {
//       alert("❌ Payment Failed");
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.container}>
//         <h2>🛒 Cart</h2>

//         {cart.map((item) => (
//           <div key={item.id} style={styles.card}>
//             <img src={item.image_url} style={styles.img} />

//             <h3>{item.name}</h3>
//             <p>${item.price}</p>

//             <div style={styles.row}>
//               <div>
//                 <button onClick={() => updateQty(item, "dec")}>-</button>

//                 <span style={{ margin: "0 10px" }}>
//                   {item.quantity}
//                 </span>

//                 <button onClick={() => updateQty(item, "inc")}>+</button>
//               </div>

//               <button
//                 style={styles.removeBtn}
//                 onClick={() => removeItem(item)}
//               >
//                 Remove
//               </button>
//             </div>
//           </div>
//         ))}

//         <button
//           onClick={() => setShowCheckout(true)}
//           style={styles.checkoutBtn}
//         >
//           Checkout 💳 (${total})
//         </button>

//         {showCheckout && (
//           <div style={styles.overlay}>
//             <div style={styles.modal}>
//               <h2>Checkout</h2>
//               <h3>Total: ${total}</h3>

//               <select
//                 value={paymentMethod}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 style={styles.input}
//               >
//                 <option value="cod">Cash on Delivery</option>
//                 <option value="card">Card</option>
//               </select>

//               {paymentMethod === "card" && (
//                 <>
//                   <input
//                     placeholder="Card Number"
//                     style={styles.input}
//                     onChange={(e) =>
//                       setCard({ ...card, card_number: e.target.value })
//                     }
//                   />
//                 </>
//               )}

//               <button style={styles.payBtn} onClick={checkout}>
//                 Place Order
//               </button>

//               <button
//                 style={styles.closeBtn}
//                 onClick={() => setShowCheckout(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     padding: 20,
//     background: "#f5f5f5",
//     minHeight: "100vh"
//   },
//   container: {
//     maxWidth: 600,
//     margin: "0 auto"
//   },
//   card: {
//     background: "#fff",
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//     border: "1px solid #ddd"
//   },
//   img: {
//     width: "100%",
//     height: 120,
//     objectFit: "cover",
//     borderRadius: 8
//   },
//   row: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center"
//   },
//   checkoutBtn: {
//     width: "100%",
//     padding: 12,
//     background: "green",
//     color: "#fff",
//     border: "none",
//     marginTop: 20
//   },
//   removeBtn: {
//     background: "red",
//     color: "#fff",
//     border: "none",
//     padding: "5px 10px",
//     borderRadius: 5
//   },
//   overlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     background: "rgba(0,0,0,0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center"
//   },
//   modal: {
//     background: "#fff",
//     padding: 20,
//     width: 400,
//     borderRadius: 10
//   },
//   input: {
//     width: "100%",
//     padding: 10,
//     marginTop: 10
//   },
//   payBtn: {
//     width: "100%",
//     padding: 12,
//     marginTop: 10,
//     background: "green",
//     color: "#fff",
//     border: "none"
//   },
//   closeBtn: {
//     width: "100%",
//     padding: 12,
//     marginTop: 10,
//     background: "red",
//     color: "#fff",
//     border: "none"
//   }
// };


import { useEffect, useState } from "react";
import API from "./api";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [card, setCard] = useState({
    card_number: "",
    expiry: "",
    cvv: "",
    name: ""
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await API.get(
      `https://dc-li58.vercel.app/cart/${user.user_id}`
    );

    setCart(res.data);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const updateQty = async (item, type) => {
    let newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;
    if (newQty < 1) return;

    await API.put("https://dc-li58.vercel.app/cart/update", {
      user_id: item.user_id,
      product_id: item.product_id,
      quantity: newQty
    });

    loadCart();
  };

  const removeItem = async (item) => {
    await API.delete("https://dc-li58.vercel.app/cart/remove", {
      data: {
        user_id: item.user_id,
        product_id: item.product_id
      }
    });

    loadCart();
  };

  const checkout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const order = await API.post(
      "https://dc-zmrn.vercel.app/order/create",
      { user_id: user.user_id }
    );

    const payment = await API.post(
      "https://dc-u3lh.vercel.app/pay",
      {
        user_id: user.user_id,
        order_id: order.data.order_id,
        amount: total,
        payment_method: paymentMethod,
        card_number: card.card_number
      }
    );

    await API.delete(
      `https://dc-li58.vercel.app/cart/clear/${user.user_id}`
    );

    setCart([]);
    setShowCheckout(false);

    if (payment.data.status === "success") {
      alert("✅ Payment Successful");
    } else if (paymentMethod === "cod") {
      alert("📦 Order placed (COD)");
    } else {
      alert("❌ Payment Failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2>🛒 Cart</h2>

        {cart.map((item) => (
          <div key={item.id} style={styles.card}>
            <img src={item.image_url} style={styles.img} />

            <h3>{item.name}</h3>
            <p>${item.price}</p>

            <div style={styles.row}>
              <div>
                <button onClick={() => updateQty(item, "dec")}>-</button>
                <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                <button onClick={() => updateQty(item, "inc")}>+</button>
              </div>

              <button style={styles.removeBtn} onClick={() => removeItem(item)}>
                Remove
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowCheckout(true)}
          style={styles.checkoutBtn}
        >
          Checkout 💳 (${total})
        </button>

        {showCheckout && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <h2>Checkout</h2>
              <h3>Total: ${total}</h3>

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={styles.input}
              >
                <option value="cod">Cash on Delivery</option>
                <option value="card">Card</option>
              </select>

              {/* CARD SECTION */}
              {paymentMethod === "card" && (
                <div style={styles.cardForm}>
                  <input
                    placeholder="Card Holder Name"
                    style={styles.input}
                    onChange={(e) =>
                      setCard({ ...card, name: e.target.value })
                    }
                  />

                  <input
                    placeholder="Card Number"
                    style={styles.input}
                    onChange={(e) =>
                      setCard({ ...card, card_number: e.target.value })
                    }
                  />

                  <input
                    placeholder="Expiry (MM/YY)"
                    style={styles.input}
                    onChange={(e) =>
                      setCard({ ...card, expiry: e.target.value })
                    }
                  />

                  <input
                    placeholder="CVV"
                    style={styles.input}
                    onChange={(e) =>
                      setCard({ ...card, cvv: e.target.value })
                    }
                  />
                </div>
              )}

              <button style={styles.payBtn} onClick={checkout}>
                Place Order
              </button>

              <button
                style={styles.closeBtn}
                onClick={() => setShowCheckout(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: 20,
    background: "#f5f5f5",
    minHeight: "100vh"
  },
  container: {
    maxWidth: 600,
    margin: "0 auto"
  },
  card: {
    background: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    border: "1px solid #ddd"
  },
  img: {
    width: "100%",
    height: 120,
    objectFit: "cover",
    borderRadius: 8
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  checkoutBtn: {
    width: "100%",
    padding: 12,
    background: "green",
    color: "#fff",
    border: "none",
    marginTop: 20
  },
  removeBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: 5
  },

  // 🔥 FIXED MODAL (IMPORTANT)
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  },

  modal: {
    background: "#fff",
    padding: 20,
    width: "90%",
    maxWidth: 400,
    borderRadius: 10,
    maxHeight: "90vh",
    overflowY: "auto"
  },

  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    boxSizing: "border-box"
  },

  cardForm: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  },

  payBtn: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    background: "green",
    color: "#fff",
    border: "none"
  },

  closeBtn: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    background: "red",
    color: "#fff",
    border: "none"
  }
};