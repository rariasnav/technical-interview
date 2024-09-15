import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const CreditCardList = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        actions.getCreditCards();
    }, []);

    const handleDelete = async (id) => {
        await actions.deleteCreditCard(id);
        actions.getCreditCards();
    };

    return (
        <div className="row">
            {store.credit_cards?.map((card) => (
                <div key={card.id} className="col-md-4 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Card number {card.card_number}</h5>
                            <p className="card-text">Balance {card.current_balance}</p>
                            <p className="card-text">Limit {card.credit_limit}</p>
                            <div className="d-flex justify-content-between">
                                <button className="btn btn-warning" onClick={() => navigate(`/edit-credit-card/${card.id}`)}>Edit</button>
                                <button className="btn btn-danger ml-2" onClick={() => handleDelete(card.id)}>Delete</button>
                            </div>                            
                        </div>                    
                    </div>
                </div>
            ))}
        </div>
    );
};