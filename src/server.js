const express = require('express');
const bodyParser = require('body-parser');
const { firestore } = require('./firebaseAdmin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Add Cash Flow Entry API
app.post('/api/cashflow', async (req, res) => {
    const { description, amount, type, userId } = req.body;

    try {
        await firestore.collection('cashflows').add({
            description,
            amount,
            type,
            userId
        });
        res.status(201).send('Cash flow entry added');
    } catch (error) {
        console.error('Error adding document: ', error);
        res.status(500).send('Error adding cash flow entry');
    }
});

// Fetch Cash Flow Entries for a User API
app.get('/api/cashflow/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const querySnapshot = await firestore.collection('cashflows').where('userId', '==', userId).get();
        const entries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(entries);
    } catch (error) {
        console.error('Error fetching documents: ', error);
        res.status(500).send('Error fetching cash flow entries');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
