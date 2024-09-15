import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { DebitCardList } from "../component/DebitCardList";
import { CreditCardList } from "../component/CreditCardList";
import { Chatbot } from "../component/Chatbot";
import { LoanList } from "../component/LoanList";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Chatbot.css";

export const Dashboard = () => {    
    const { store } = useContext(Context);
    const navigate = useNavigate();

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Dashboard</h1>

            {!store.user_data && (
                <div className="text-center my-5">
                    <p>Welcome to HPBank, please <Link to="/login">login</Link> or <Link to="/signup">register</Link></p>
                </div>
            )}

            {store.user_data && (
                <>
                    <div className="mb-4">
                        <h2>Debit Cards</h2>
                        <button className="btn btn-primary mb-3" onClick={() => navigate('/add-debit-card')}>Add Debit card</button>
                        <DebitCardList />
                    </div>     

                    <div className="mb-4">
                        <h2>Credit Cards</h2>
                        <button className="btn btn-primary mb-4" onClick={() => navigate('/add-credit-card')}>Add Credit card</button>
                        <CreditCardList />
                    </div>            

                    <div className="mb-4">
                        <h2>Loans</h2>
                        <button className="btn btn-primary mb-4" onClick={() => navigate('/add-loan')}>Add Loan</button>
                        <LoanList />
                    </div>
                </>
            )}
            <div className="chatbot-container">
                <h2>HPChatbot</h2>
                <Chatbot />
            </div>                
        </div>
    );
};