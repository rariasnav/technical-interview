import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Signup = () => {
    const { store, actions } = useContext(Context);
    const [username, setUsername] = useState("");
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

        // Validación de contraseña
        if (password.length < 6) {
            setMessage('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await actions.signup({ username, email, password });

            if (response.error) {
                console.log(response.error)
                if (response.error.includes('Email already in use')) {
                    setMessage('Email already in use');
                } else if (response.error.includes('Username already in use')) {
                    setMessage('Username already in use');
                } else {
                    setMessage('Error creating user');
                }
            } else {
                setMessage('User created');
            }
        } catch (error) {
            setMessage('Error creating user');
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="text-center mb-4">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
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
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </form>
            </div>
        </div>
    )
};