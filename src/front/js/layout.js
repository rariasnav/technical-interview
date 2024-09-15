import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Dashboard } from "./pages/Dashboard";
import { KPIDashboard } from "./pages/KPIDashboard";
import injectContext from "./store/appContext";

import { Signup } from "./component/Signup";
import { Login } from "./component/Login";
import { DebitCardForm } from "./component/DebitCardForm";
import { CreditCardForm } from "./component/CreditCardForm";
import { LoanForm } from "./component/LoanForm";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem('token');
    return token ? element : <Navigate to="/login" />;
};

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/kpi" element={<KPIDashboard />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/add-debit-card" element={<PrivateRoute element={<DebitCardForm />} />} />
                        <Route path="/edit-debit-card/:id" element={<PrivateRoute element={<DebitCardForm />} />} />
                        <Route path="/add-credit-card" element={<PrivateRoute element={<CreditCardForm />} />} />
                        <Route path="/edit-credit-card/:id" element={<PrivateRoute element={<CreditCardForm />} />} />
                        <Route path="/add-loan" element={<PrivateRoute element={<LoanForm />} />} />
                        <Route path="/edit-loan/:id" element={<PrivateRoute element={<LoanForm />} />} />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
