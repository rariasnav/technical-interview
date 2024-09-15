import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const handleLogout = async () => {
		await actions.logout();
		navigate('/');
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
			<div className="container">
				<Link to="/" className="navbar-brand">
					<span className="mb-0 h1">HPBank</span>
				</Link>
				<div className="ml-auto d-flex align-items-center">
                    {store.user_data ? (
                        <>
                            <span className="me-3">Welcome, {store.user_data.username}</span>
                            <button onClick={handleLogout} className="btn btn-outline-danger">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-outline-primary">
                            Login
                        </Link>
                    )}
					<Link to="/kpi" className="btn btn-outline-primary mx-2">
                            View KPIs
                    </Link>
                </div>
			</div>
		</nav>
	);
};
