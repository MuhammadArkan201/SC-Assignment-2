import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { firestore } from '../firebase';
import { useAuth } from '../authContext';
import './CashFlowForm.css';

function CashFlowForm({ setEntries, entryToEdit, setEntryToEdit }) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('cash_in');
    const { currentUser } = useAuth();

    useEffect(() => {
        if (entryToEdit) {
            setDescription(entryToEdit.description);
            setAmount(entryToEdit.amount);
            setType(entryToEdit.type);
        }
    }, [entryToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert('You must be logged in to add or edit a cash flow entry.');
            return;
        }

        try {
            if (entryToEdit) {
                // Update existing entry
                const entryRef = doc(firestore, 'cashflows', entryToEdit.id);
                await updateDoc(entryRef, {
                    description,
                    amount,
                    type,
                });
                alert('Cash flow entry updated');
                setEntryToEdit(null);
            } else {
                // Add new entry
                await addDoc(collection(firestore, 'cashflows'), {
                    description,
                    amount,
                    type,
                    userId: currentUser.uid,
                });
                alert('Cash flow entry added');
            }

            setDescription('');
            setAmount('');

            // Fetch updated entries
            const q = query(collection(firestore, 'cashflows'), where('userId', '==', currentUser.uid));
            const querySnapshot = await getDocs(q);
            const entries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEntries(entries);

            // Hard reload the page
            window.location.reload();
        } catch (error) {
            console.error('Error adding or updating document: ', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
            >
                <option value="cash_in">Cash In</option>
                <option value="cash_out">Cash Out</option>
            </select>
            <button type="submit">{entryToEdit ? 'Update Entry' : 'Add Entry'}</button>
        </form>
    );
}

export default CashFlowForm;
