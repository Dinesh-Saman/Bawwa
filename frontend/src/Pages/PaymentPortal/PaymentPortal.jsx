import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../CartPage/CartContext";
import "./PaymentPortal.css";
import swal from 'sweetalert2';

const PaymentPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, setCart } = useCart();
  const total = location.state?.total || 0;

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    cardHolderName: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    cardHolderName: ""
  });

  // Format card number as user types (adds spaces every 4 digits)
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };

  // Format expiration date as MM/YY
  const formatExpirationDate = (value) => {
    const v = value.replace(/[^0-9]/g, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "cardNumber") {
      setCardDetails(prev => ({
        ...prev,
        [name]: formatCardNumber(value)
      }));
    } else if (name === "expirationDate") {
      setCardDetails(prev => ({
        ...prev,
        [name]: formatExpirationDate(value)
      }));
    } else if (name === "cvv") {
      // Only allow numbers and limit to 3-4 digits
      const cvvValue = value.replace(/[^0-9]/g, '').slice(0, 4);
      setCardDetails(prev => ({
        ...prev,
        [name]: cvvValue
      }));
    } else {
      setCardDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Validate card number using Luhn algorithm
  const validateCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(cleaned)) {
      return "Card number must be 16 digits";
    }
    
    // Implement Luhn algorithm if needed
    // For now, just return empty string to indicate validation passed
    return "";
  };

  const validateExpirationDate = (expDate) => {
    if (!expDate) return "Expiration date is required";
    
    const [month, year] = expDate.split('/');
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return "Expiration date must be in MM/YY format";
    }
    
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    const expYear = parseInt(year, 10);
    const expMonth = parseInt(month, 10);
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return "Card has expired";
    }
    
    if (expMonth < 1 || expMonth > 12) {
      return "Invalid month";
    }
    
    return "";
  };

  const validateCVV = (cvv) => {
    if (!cvv) return "CVV is required";
    if (!/^\d{3,4}$/.test(cvv)) return "CVV must be 3 digits";
    return "";
  };

  const validateCardHolderName = (name) => {
    if (!name.trim()) return "Cardholder name is required";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Invalid characters in name";
    return "";
  };

  const validateForm = () => {
    const errors = {
      cardNumber: validateCardNumber(cardDetails.cardNumber),
      expirationDate: validateExpirationDate(cardDetails.expirationDate),
      cvv: validateCVV(cardDetails.cvv),
      cardHolderName: validateCardHolderName(cardDetails.cardHolderName)
    };
    
    setValidationErrors(errors);
    return !Object.values(errors).some(error => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending payment request:", {
        ...cardDetails,
        totalAmount: total,
        items: cart,
      });

      const response = await axios.post("http://localhost:5000/api/process-payment", {
        ...cardDetails,
        totalAmount: total,
        items: cart,
      });

      console.log("Payment response:", response);

      if (response.status === 201 || response.status === 200) {
        setCart([]);
        
        // Show SweetAlert on success
        swal.fire({
          title: 'Payment Successful!',
          html: `<p>Your payment of LKR ${total.toFixed(2)} was processed successfully.</p>`,
          icon: 'success',
          showConfirmButton: true,
          confirmButtonText: 'Continue Shopping',
          confirmButtonColor: '#F97316',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/PetModel");
          }
        });
      }
    } catch (err) {
      console.error("Payment error:", err);
      
      // Show error SweetAlert
      swal.fire({
        title: 'Payment Failed',
        html: `<p>${err.response?.data?.message || "Payment processing failed. Please try again."}</p>`,
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#F97316',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/PetModel");
  };

  return (
    <div className="payment-page-container">
      <div className="payment-container">
        <h2>Payment Portal</h2>
        <p>Total Amount: LKR {total.toFixed(2)}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cardholder Name:</label>
            <input
              type="text"
              name="cardHolderName"
              value={cardDetails.cardHolderName}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
              maxLength={50}
            />
            {validationErrors.cardHolderName && (
              <p className="error-message">{validationErrors.cardHolderName}</p>
            )}
          </div>

          <div className="form-group">
            <label>Card Number:</label>
            <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                required
                maxLength={19}
              />
            {validationErrors.cardNumber && (
              <p className="error-message">{validationErrors.cardNumber}</p>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiration Date:</label>
              <input
                type="text"
                name="expirationDate"
                value={cardDetails.expirationDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                required
                maxLength={5}
              />
              {validationErrors.expirationDate && (
                <p className="error-message">{validationErrors.expirationDate}</p>
              )}
            </div>

            <div className="form-group">
              <label>CVV:</label>
              <input
                type="password"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                placeholder="123"
                required
                maxLength={4}
              />
              {validationErrors.cvv && (
                <p className="error-message">{validationErrors.cvv}</p>
              )}
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              "Complete Payment"
            )}
          </button>
        </form>

        <button onClick={() => navigate("/PetModel")} className="payment-cancel-btn">
          Cancel
        </button>

        {error && <p className="error-message">{error}</p>}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Payment Completed Successfully!</h3>
            <p>Your payment has been processed. Thank you for your purchase!</p>
            <div className="modal-buttons">
              <button className="modal-button secondary" onClick={() => navigate("/PetModel")}>
                Back to Shop
              </button>
              <button className="modal-button primary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPortal;