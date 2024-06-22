import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { firestore } from '../firebase';
import { useAuth } from '../authContext';
import './CashFlowList.css';

function CashFlowList({ setEntryToEdit }) {
    const [entries, setEntries] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchEntries = async () => {
            if (!currentUser) {
                return;
            }
            try {
                const q = query(collection(firestore, 'cashflows'), where('userId', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);
                const entries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEntries(entries);
            } catch (error) {
                console.error(error);
            }
        };
        fetchEntries();
    }, [currentUser]);

    const deleteEntry = async (id) => {
        try {
            await deleteDoc(doc(firestore, 'cashflows', id));
            alert('Entry deleted');
            setEntries(entries.filter(entry => entry.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="cashflow-list-container">
            <h3>Cash Flow Entries</h3>
            <ul>
                {entries.map((entry) => (
                    <li key={entry.id} className="entry-item">
                        <span>{entry.description}: {entry.amount} ({entry.type})</span>
                        <div className="entry-buttons">
                            <button onClick={() => setEntryToEdit(entry)} className="edit-button">Edit</button>
                            <button onClick={() => deleteEntry(entry.id)} className="delete-button">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CashFlowList;
