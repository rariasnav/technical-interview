import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { KPIChart } from "../component/KPIChart";

export const KPIDashboard = () => {
    const { actions } = useContext(Context);
    const [loansAndLimits, setLoansAndLimits] = useState({});
    const [customerUsage, setCustomerUsage] = useState({});
    const [loanRepayment, setLoanRepayment] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const loanResponse = await actions.getTotalLoansAndLimits();
            setLoansAndLimits(loanResponse);

            const usageResponse = await actions.getCustomerUsageAnalytics();
            setCustomerUsage(usageResponse);

            const repaymentResponse = await actions.getLoanRepaymentInsights();
            setLoanRepayment(repaymentResponse);
        };

        fetchData();
    }, [actions]); 

    return (
        <div className="container mt-5">
            <h2 className="mb-4">KPIs Dashboard</h2>
            
            <div className="row">
                <div className="col-md-6">
                    <h4>Total Loans and Total Credit Limits</h4>
                    <KPIChart 
                        data={[loansAndLimits.total_loans, loansAndLimits.total_credit_limits]} 
                        labels={["Total Loans", "Total Credit Limits"]} 
                        title="Loans vs Limits"
                    />
                </div>

                <div className="col-md-6">
                    <h4>Debit and Credit cards usage</h4>
                    <KPIChart 
                        data={[customerUsage.total_debit_cards, customerUsage.total_credit_cards]} 
                        labels={["Debit Cards", "Credit Cards"]} 
                        title="Cards Usage"
                    />
                </div>
            </div>

            <div className="row mt-5">
                <div className="col-md-6">
                    <h4>Loan Repayments</h4>
                    <KPIChart 
                        data={[loanRepayment.total_loans, loanRepayment.total_repaid, loanRepayment.total_pending]} 
                        labels={["Total Loans", "Repaid Loans", "Pending Loans"]} 
                        title="Loan Status"
                    />
                </div>
            </div>
        </div>
    );
};