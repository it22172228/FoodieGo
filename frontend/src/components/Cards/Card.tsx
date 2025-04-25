import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Card.css";
import { Modal, Button } from "react-bootstrap";

interface CardProps {
  image: string;
  productName: string;
  prodLink: string;
  prodCategory: string;
  price: number;
}

const Card: React.FC<CardProps> = ({ image, productName, prodLink, prodCategory, price }) => {
  const [show, setShow] = useState<boolean>(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <div className="col-md-4">
      <div className="card shadow-sm card-hover">
        <img src={image} className="card-img-top" alt={productName} />
        <div className="card-body text-center">
          <h5 className="card-title">{productName}</h5>
          <p className="card-text text-muted">{prodCategory}</p>
          <h4 className="price-tag">${price}</h4>
          <Link to={prodLink} className="btn btn-outline-primary btn-sm me-2">
            Details
          </Link>
          <button className="btn btn-primary btn-sm" onClick={handleShow}>
            Order
          </button>
        </div>
      </div>

      {/* Popup Modal for Order Confirmation */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Do you want to add <strong>{productName}</strong> to your cart?
          </p>
          <p>
            <strong>Price:</strong> ${price}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Link
            to="/add-cart"
            state={{ product: { productName, image, price, prodCategory } }}
          >
            <Button variant="primary">Confirm Order</Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Card;
