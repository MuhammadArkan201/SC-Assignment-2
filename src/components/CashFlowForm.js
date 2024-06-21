import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { firestore } from '../firebase';
import { useAuth } from '../authContext';
import './CashFlowForm.css';

function CashFlowForm({ setEntries }) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('cash_in');
    const { currentUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert('You must be logged in to add a cash flow entry.');
            return;
        }
        try {
            await addDoc(collection(firestore, 'cashflows'), {
                description,
                amount,
                type,
                userId: currentUser.uid,
            });
            alert('Cash flow entry added');
            setDescription('');
            setAmount('');

            // Fetch updated entries
            const q = query(collection(firestore, 'cashflows'), where('userId', '==', currentUser.uid));
            const querySnapshot = await getDocs(q);
            const entries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEntries(entries);
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="cash_in">Cash In</option>
                <option value="cash_out">Cash Out</option>
            </select>
            <button type="submit">Add Entry</button>
        </form>
    );
}

export default CashFlowForm;