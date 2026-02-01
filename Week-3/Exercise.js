// Import the Express module
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let users = [
    { id: 1, name: 'Mohsin', email: 'mohsin@example.com' },
    { id: 2, name: 'Arif', email: 'arif@example.com' }
];

app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(user => user.id === userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.post('/users', (req, res) => {
    const newUser = req.body;
    newUser.id = users.length + 1;
    users.push(newUser);
    res.json({ message: 'User created', user: newUser });
});



app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...req.body };
        res.json({ message: `User with ID ${userId} updated`, user: users[userIndex] });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.json({ message: `User with ID ${userId} deleted` });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});