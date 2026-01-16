const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

const FILE_PATH = './users.json';

const readUsers = () => {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        return JSON.parse(data || '[]');
    } catch (err) {
        return [];
    }
};

const writeUsers = (users) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2));
};

// 1. Add User (POST /user)
app.post('/user', (req, res) => {
    const { name, age, email } = req.body;
    const users = readUsers();

    const emailExists = users.find(user => user.email === email);
    if (emailExists) {
        return res.json({ message: "Email already exists." });
    }

    const id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    const newUser = { id, name, age, email };
    
    users.push(newUser);
    writeUsers(users);

    res.json({ message: "User added successfully." });
});

// 2. Update User (PATCH /user/:id)
app.patch('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updates = req.body;
    const users = readUsers();

    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.json({ message: "User ID not found." });
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    writeUsers(users);

    res.json({ message: "User updated successfully." });
});

// 3. Delete User (DELETE /user/:id)
app.delete(['/user/:id', '/user'], (req, res) => {
    let id = req.params.id ? parseInt(req.params.id) : req.body.id;
    
    const users = readUsers();
    const newUsers = users.filter(user => user.id !== id);

    if (users.length === newUsers.length) {
        return res.json({ message: "User ID not found." });
    }

    writeUsers(newUsers);
    res.json({ message: "User deleted successfully." });
});

// 4. Get User by Name (GET /user/getByName)
app.get('/user/getByName', (req, res) => {
    const { name } = req.query;
    const users = readUsers();
    
    const user = users.find(u => u.name.toLowerCase() === name.toLowerCase());

    if (!user) {
        return res.json({ message: "User name not found." });
    }

    res.json(user);
});

// 6. Filter Users by Min Age (GET /user/filter)
// Placed before general GET /user to avoid route conflict if structure changes, 
app.get('/user/filter', (req, res) => {
    const minAge = parseInt(req.query.minAge);
    const users = readUsers();

    const filteredUsers = users.filter(user => user.age >= minAge);

    if (filteredUsers.length === 0) {
        return res.json({ message: "no user found" });
    }

    res.json(filteredUsers);
});

// 7. Get User by ID (GET /user/:id)
app.get('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const users = readUsers();

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.json({ message: "User not found." });
    }

    res.json(user);
});

// 5. Get All Users (GET /user)
app.get('/user', (req, res) => {
    const users = readUsers();
    res.json(users);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});