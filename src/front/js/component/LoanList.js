import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const LoanList = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        actions.getLoans();
    }, []);

    const handleDelete = async (id) => {
        await actions.deleteLoan(id);
        actions.getLoans();
    };  

    return (
        <div className="row">
            {store.loans?.map((loan) => (
                <div key={loan.id} className="col-md-4 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Loan type {loan.loan_type}</h5>
                            <p className="card-text">Loan amount {loan.amount}</p>
                            <p className="card-text">Start date {loan.start_date}</p>
                            <p className="card-text">End date {loan.end_date}</p>
                            <div className="d-flex justify-content-between">
                                <button className="btn btn-warning" onClick={() => navigate(`/edit-loan/${loan.id}`)}>Edit</button>
                                <button className="btn btn-danger ml-2" onClick={() => handleDelete(loan.id)}>Delete</button>
                            </div>
                        </div>                    
                    </div>
                </div>
            ))}
        </div>
    );
};