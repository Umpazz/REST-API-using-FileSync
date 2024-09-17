const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

const usersFilePath = path.join(__dirname, 'users.json');

// Helper functions to read and write to the JSON file
const readUsersFromFile = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const writeUsersToFile = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
};

// GET: List all users
app.get('/api/users', (req, res) => {
    const users = readUsersFromFile();
    res.json(users);
});

// GET: Get a user by id (index in the JSON array)
app.get('/api/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const user = users[req.params.id];

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
});

// POST: Add a new user
app.post('/api/users', (req, res) => {
    const newUser = req.body;

    if (!newUser.name || !newUser.email || !newUser.age) {
        return res.status(400).json({ error: 'Name, email, and age are required.' });
    }

    const users = readUsersFromFile();
    users.push(newUser);
    writeUsersToFile(users);

    res.status(201).json({ message: 'User added successfully!', user: newUser });
});

// PUT: Update a user by id
app.put('/api/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const userIndex = req.params.id;

    if (!users[userIndex]) {
        return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = req.body;
    if (!updatedUser.name || !updatedUser.email || !updatedUser.age) {
        return res.status(400).json({ error: 'Name, email, and age are required.' });
    }

    users[userIndex] = updatedUser;
    writeUsersToFile(users);

    res.json({ message: 'User updated successfully!', user: updatedUser });
});

// DELETE: Delete a user by id
app.delete('/api/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const userIndex = req.params.id;

    if (!users[userIndex]) {
        return res.status(404).json({ error: 'User not found' });
    }

    users.splice(userIndex, 1);
    writeUsersToFile(users);

    res.json({ message: 'User deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
