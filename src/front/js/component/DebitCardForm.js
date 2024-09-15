import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const DebitCardForm = () => {
    const { store, actions } = useContext(Context);
    const [cardNumber, setCardNumber] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [balance, setBalance] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(()=> {
        if (id && store.debit_cards.length > 0) {
            const card = store.debit_cards.find(card => card.id === parseInt(id));            
            if (card) {
                setCardNumber(card.card_number);
                setBalance(card.balance);
                setExpirationDate(card.expiration_date);
            }
        }
    }, [id, store.debit_cards]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const cardData = {
            card_number: cardNumber,
            balance,
            expiration_date: expirationDate
        };

        if (id) {
            actions.updateDebitCard(id, cardData);
        } else {
            actions.createDebitCard(cardData);
        }
        navigate('/');
    };

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="text-center mb-4">{id ? "Edit" : "Add"} Debit card</h2>
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