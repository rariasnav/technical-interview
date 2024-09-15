import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Login = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (store.user_data) {
            navigate('/');
        }
    }, [store.user_data, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = await actions.login({email, password});
            if (token.error) {
                setMessage(token.error);
            } else {
                localStorage.setItem('token', token);
                await actions.getSession();
                alert('Logged in successfully!');
                navigate('/');
            }            
        } catch (error) {
            setMessage('Error during login');
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {message && <div className="alert alert-danger">{message}</div>}
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};