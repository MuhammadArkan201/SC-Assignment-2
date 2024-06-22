import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from '../authContext';
import CashFlowForm from './CashFlowForm';
import CashFlowList from './CashFlowList';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [entries, setEntries] = useState([]);
    const [entryToEdit, setEntryToEdit] = useState(null);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

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

    return (
        <div className="dashboard-container">
            <h2>Cash Flow App Dashboard</h2>
            <button onClick={handleLogout} className="logout-button">Logout</button>
            <CashFlowForm setEntries={setEntries} entryToEdit={entryToEdit} setEntryToEdit={setEntryToEdit} />
            <CashFlowList entries={entries} setEntryToEdit={setEntryToEdit} />
        </div>
    );
}

export default Dashboard;
