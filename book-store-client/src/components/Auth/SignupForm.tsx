import React, { useState } from 'react';
import { signUp } from '../../services/auth';
import './auth.css';

interface SignupFormProps {
  toggleForm: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ toggleForm }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await signUp(name, phone, address, password);
            alert('Sign Up successful! You can now log in.');
            // Optionally redirect to login or home page
        } catch (err) {
            setError('Sign Up failed. Please try again.');
        }
    };

    return (
        <div className="container" id="signup-form">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Sign Up</button>
                {error && <p className="error">{error}</p>}
            </form>
            <p className="toggle" onClick={toggleForm}>
                Already have an account? Login
            </p>
        </div>
    );
};

export default SignupForm;