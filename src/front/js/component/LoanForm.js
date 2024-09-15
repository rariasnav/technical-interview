import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const LoanForm = () => {
    const { store, actions } = useContext(Context);
    const [loanType, setLoanType] = useState("");
    const [amount, setAmount] = useState("");
    const [interesRate, setInteresRate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id && store.loans.length > 0) {
            const loan = store.loans.find(loan => loan.id === parseInt(id));
            if (loan) {
                setLoanType(loan.loan_type);
                setAmount(loan.amount);
                setInteresRate(loan.interest_rate);
                setStartDate(loan.start_date);
                setEndDate(loan.end_date);
            }
        }
    }, [id, store.loans]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loanData = {
            loan_type: loanType,
            amount,
            interest_rate: interesRate,
            start_date: startDate,
            end_date: endDate
        };

        if (id) {
            actions.updateLoan(id, loanData);
        } else {
            actions.createLoan(loanData);
        }
        navigate('/');
    };

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="text-center mb-4">{id ? "Edit" : "Add"} loan</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Loan type: </label>
                        <input
                            type="text"
                            className="form-control mb-3"
                            value={loanType}
                            onChange={(e) => setLoanType(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Amount: </label>
                        <input
                            type="number"
                            className="form-control"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Interest rate: </label>
                        <input
                            type="number"
                            className="form-control"
                            value={interesRate}
                            onChange={(e) => setInteresRate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Start date: </label>
                        <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>End date: </label>
                        <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
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