// EditCartItems.tsx
import React, { useEffect, useState } from 'react';
import axios from "../Utils/axiosConfig"
import { useParams, useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddToCart.css";

interface CartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  total: number;
}

const EditCartItems: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<CartItem>({
    _id: "",
    name: "",
    image: "",
    price: 0,
    qty: 1,
    total: 0
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCartItem = async () => {
      try {
        const { data } = await axios.get<CartItem>(`/carts/${id}`);
        setItem(data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError("Failed to load cart item");
        }
      }
    };
    fetchCartItem();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = name === "qty" ? Math.max(1, parseInt(value) || 1) : value;
    
    setItem(prev => ({
      ...prev,
      [name]: numericValue,
      total: name === "qty" 
        ? (numericValue as number * prev.price)
        : prev.total
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/carts/${id}`, item);
      navigate("/view-cart");
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError("Update failed. Please try again.");
      }
    }
  };

  return (
    <div className="container cart-container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="cart-title text-center">Edit Cart Item</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-3">
            <img src={item.image} alt={item.name} className="cart-img rounded" />
          </div>

          <div className="mb-3">
            <label>Item Name:</label>
            <input 
              type="text" 
              className="form-control" 
              value={item.name} 
              readOnly 
            />
          </div>

          <div className="mb-3">
            <label>Price:</label>
            <input 
              type="number" 
              className="form-control" 
              value={item.price} 
              readOnly 
            />
          </div>

          <div className="mb-3">
            <label>Quantity:</label>
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
            <label>Total:</label>
            <input 
              type="text" 
              className="form-control" 
              value={item.total.toFixed(2)} 
              readOnly 
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Update Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCartItems;
