// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Transaction = require('./models/transaction');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/money_tracker', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home Page - Display list of transactions
app.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: 'desc' });
    res.sendFile(__dirname + '/views/index.html');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch all transactions
app.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: 'desc' });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle Transaction Form Submission
app.post('/transaction', async (req, res) => {
  try {
    const { type, amount, description } = req.body;
    const newTransaction = new Transaction({ type, amount, description });
    await newTransaction.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
