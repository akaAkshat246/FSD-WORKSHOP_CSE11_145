import express from "express";
import os from "os";

const app = express();
app.use(express.json());


let userData = [
    { id: 1, name: "Akshat", email: "avs@gmail.com" },
    { id: 2, name: "Akarsh", email: "akarsh@gmail.com" },
    { id: 3, name: "Arsh", email: "arsh@gmail.com" },
    { id: 4, name: "Ashwani", email: "ashwani@gmail.com" }
];

let registeredData = [
    { id: 1, name: "Akshat Kumar", email: "ak@gmail.com" },
    { id: 2, name: "Akarsh", email: "akarsh@gmail.com" },
    { id: 3, name: "Arsh", email: "arsh@gmail.com" },
    { id: 4, name: "Anwar", email: "anwar@gmail.com" }
];


app.get("/", (req, res) => {
    try {
        res.status(200).json({ msg: "Welcome to Express Server" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.get("/sys", (req, res) => {
    try {
        res.status(200).json({
            msg: "System Information",
            info: { platform: os.platform(), uptime: os.uptime() }
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


app.get("/user", (req, res) => {
    try {
        res.status(200).json({ msg: "User info retrieved", data: userData });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.post("/create", (req, res) => {
    try {
        const { name, email } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ error: "Missing required fields: name or email" });
        }
        const newUser = { id: userData.length + 1, name, email };
        userData.push(newUser); 
        res.status(201).json({ 
            msg: "User created successfully", 
            data: newUser 
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.get("/user/:id", (req, res) => {
    try {
        const user = userData.find(u => u.id === parseInt(req.params.id));
        if (!user) return res.status(404).json({ error: "User not found" });
        
        res.status(200).json({ msg: "User retrieved successfully", data: user });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.put("/user/:id", (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const index = userData.findIndex(u => u.id === userId);
        
        if (index === -1) return res.status(404).json({ error: "User not found" });

   
        userData[index] = { ...userData[index], ...req.body };
        res.status(200).json({ msg: "User updated successfully", data: userData[index] });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.delete("/user/:id", (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const exists = userData.some(u => u.id === userId);
        
        if (!exists) return res.status(404).json({ error: "User not found" });

        userData = userData.filter(u => u.id !== userId);
        res.status(200).json({ msg: `User ${userId} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


app.get("/registered", (req, res) => {
    try {
        res.status(200).json({ msg: "Registered data retrieved", data: registeredData });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.post("/registered", (req, res) => {
    try {
        const { id, name, email } = req.body;
        
        if (!id || !name || !email) {
            return res.status(400).json({ error: "Missing required fields: id, name, or email" });
        }

        
        if (registeredData.some(u => u.id === id)) {
            return res.status(409).json({ error: "A user with this ID is already registered" });
        }

        const newUser = { id, name, email };
        registeredData.push(newUser); 
        res.status(201).json({ msg: "User registered successfully", data: newUser });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});