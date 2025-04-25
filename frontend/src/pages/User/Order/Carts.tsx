// Carts.tsx
import React, { useState, useEffect } from "react";
import axios from "../Utils/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
// import Nav from "../../Component/Nav";
import "bootstrap/dist/css/bootstrap.min.css";
import "./cart.css";
import { loadStripe } from "@stripe/stripe-js";

interface CartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  total: number;
}

const Carts: React.FC = () => {
  const [carts, setCarts] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const { data } = await axios.get<{ carts: CartItem[] }>("/carts/");
        setCarts(data.carts);
      } catch (error: any) {
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load cart items");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCarts();
  }, [navigate]);

  useEffect(() => {
    const total = carts.reduce((acc, cart) => acc + cart.total, 0);
    setTotalAmount(total);
  }, [carts]);

  const handleRemoveFromCart = async (id: string) => {
    try {
      await axios.delete(`/carts/${id}`);
      setCarts(prev => prev.filter(cart => cart._id !== id));
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        alert("Failed to remove item");
      }
    }
  };

  const makePayment = async () => {
    const stripe = await loadStripe("pk_test_51RDI58FfB6lW4ek0nhTfFa3p5oZ9EQXQfjPh93RJ8qUSeDM3CuQGei8XTbQOTVODiwDh2DGNz8RkJwJ3ebhDSroH003LElCvhu");
    
    try {
      const { data } = await axios.post<{ id: string }>("/create-checkout-session", {
        products: carts
      });

      await stripe?.redirectToCheckout({
        sessionId: data.id
      });
    } catch (error) {
      alert("Payment initialization failed");
    }
  };

  return (
    <div>
      {/* <Nav /> */}
      <div className="container mt-5">
        <h1 className="text-center text-primary fw-bold">Your Cart</h1>
        <div className="d-flex justify-content-between my-3">
          <Link to="/viewallcarts" className="btn btn-primary">Add Items</Link>
          <button className="btn btn-warning">Download Report</button>
        </div>

        {loading ? (
          <div className="text-center">Loading cart items...</div>
        ) : error ? (
          <div className="text-danger text-center">{error}</div>
        ) : (
          <div className="row">
            {carts.length === 0 ? (
              <div className="text-center">Your cart is empty</div>
            ) : (
              <>
                {carts.map(cart => (
                  <div key={cart._id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card shadow-sm">
                      <img src={cart.image} className="card-img-top" alt={cart.name} />
                      <div className="card-body">
                        <h5 className="card-title">{cart.name}</h5>
                        <p className="text-muted">Price: ${cart.price}</p>
                        <p className="text-muted">Quantity: {cart.qty}</p>
                        <p className="text-danger fw-bold">Total: ${cart.total}</p>
                        <div className="d-flex justify-content-between">
                          <button 
                            className="btn btn-danger"
                            onClick={() => handleRemoveFromCart(cart._id)}
                          >
                            Remove
                          </button>
                          <Link 
                            to={`/update-cart/${cart._id}`}
                            className="btn btn-primary"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="col-12 mt-4 text-center">
                  <h3>
                    Total: <span className="text-success">${totalAmount.toFixed(2)}</span>
                  </h3>
                  <button 
                    className="btn btn-success btn-lg mt-3"
                    onClick={makePayment}
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Carts;
