import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const CreditCardForm = () => {
    const { store, actions } = useContext(Context);
    const [cardNumber, setCardNumber] = useState("");
    const [balance, setBalance] = useState("");
    const [limit, setLimit] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id && store.credit_cards.length > 0) {
            const card = store.credit_cards.find(card => card.id === parseInt(id));
            if (card) {
                setCardNumber(card.card_number);
                setBalance(card.current_balance);
                setLimit(card.credit_limit);
                setExpirationDate(card.expiration_date);
            }
        }
    }, [id, store.credit_cards]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cardData = {
            card_number: cardNumber,
            current_balance: balance,
            credit_limit: limit,
            expiration_date: expirationDate
        }

        if (id) {
            actions.updateCreditCard(id, cardData);
        } else {
            actions.createCreditCard(cardData);
        }
        navigate('/');
    };

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="text-center mb-4">{id ? "Edit" : "Add"} Credit card</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label>Card number</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={cardNumber} 
                            onChange={(e) => setCardNumber(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Balance</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            value={balance} 
                            onChange={(e) => setBalance(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Limit</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            value={limit} 
                            onChange={(e) => setLimit(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Expiration date</label>
                        <input 
                            type="date" 
                            className="form-control" 
                            value={expirationDate} 
                            onChange={(e) => setExpirationDate(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">{id ? "Update" : "Add"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};