import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const DebitCardList = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        actions.getDebitCards()
    }, []);

    const handleDelete = async (id) => {
        await actions.deleteDebitCard(id);
        actions.getDebitCards();
    };
    
    return (
        <div className="row">
            {store.debit_cards?.map((card) => (
                <div key={card.id} className="col-md-4 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Card number {card.card_number}</h5>
                            <p className="card-text">Balance: ${card.balance}</p>
                            <div className="d-flex justify-content-between">
                                <button className="btn btn-warning" onClick={() => navigate(`/edit-debit-card/${card.id}`)}>Edit</button>
                                <button className="btn btn-danger ml-2" onClick={() => handleDelete(card.id)}>Delete</button>
                            </div>                            
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};