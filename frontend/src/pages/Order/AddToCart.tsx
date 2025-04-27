// AddToCart.tsx
import React, { useState, useEffect } from "react";
import axios from "../Utils/axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddToCart.css";

interface Product {
  productName: string;
  image: string;
  price: number;
}

interface CartItem {
  name: string;
  image: string;
  price: number;
  qty: number;
  total: string;
}

const AddToCart: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [item, setItem] = useState<CartItem>({
    name: "",
    image: "",
    price: 0,
    qty: 1,
    total: "0.00"
  });

  useEffect(() => {
    const product = (location.state as { product?: Product })?.product;
    if (product) {
      setItem({
        name: product.productName,
        image: product.image,
        price: product.price,
        qty: 1,
        total: product.price.toFixed(2)
      });
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = name === "qty" ? Math.max(1, parseInt(value) || 1) : value;
    
    setItem(prev => ({
      ...prev,
      [name]: numericValue,
      total: name === "qty" 
        ? (numericValue as number * prev.price).toFixed(2) 
        : prev.total
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/carts/", {
        ...item,
        price: item.price,  // Explicitly send as number
        qty: item.qty
      });
      navigate("/view-cart");
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        alert("Error adding item to cart");
      }
    }
  };

  return (
    <div className="container cart-container">
      <div className="card shadow-lg p-4">
        <h2 className="cart-title text-center">Add Food to Cart</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-center">
            <img src={item.image} alt={item.name} className="cart-img" />
          </div>

          <div className="mb-3">
            <label className="form-label">Name:</label>
            <input type="text" className="form-control" value={item.name} readOnly />
          </div>

          <div className="mb-3">
            <label className="form-label">Price:</label>
            <input 
              type="number" 
              className="form-control" 
              value={item.price}
              readOnly 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Quantity:</label>
            <input
              type="number"
              name="qty"
              className="form-control"
              value={item.qty}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Total:</label>
            <input 
              type="text" 
              className="form-control" 
              value={item.total} 
              readOnly 
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Add to Cart
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddToCart;
