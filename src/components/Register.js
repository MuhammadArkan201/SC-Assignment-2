import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Firebase Auth:', auth);
        console.log('Email:', email);
        console.log('Password:', password);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User Credential:', userCredential);
            alert('Registration successful');
            window.location.href = '/dashboard';
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Register</button>
        </form>
    );
}

export default Register;