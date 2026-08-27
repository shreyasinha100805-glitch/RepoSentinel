// Safe Demo Repository Code - Intentional Code Security Flaws for Demo Purposes
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();

app.use(express.json());

// Code Flaw 1: Dynamic Evaluation (Unsafe Eval)
app.post('/api/calculate', (req, res) => {
    const { formula } = req.body;
    // Vulnerable: Unsafe eval call on user input
    const result = eval(formula);
    res.json({ result });
});

// Code Flaw 2: Unsanitized SQL Query Concatenation (SQL Injection)
app.get('/api/users', (req, res) => {
    const userId = req.query.id;
    // Vulnerable: String concatenation in SQL query
    const query = "SELECT * FROM users WHERE id = '" + userId + "'";
    res.json({ query, status: "executed" });
});

// Code Flaw 3: Unsanitized Command Execution (Command Injection)
app.post('/api/ping', (req, res) => {
    const { host } = req.body;
    // Vulnerable: Unsanitized input passed directly to child_process exec
    exec("ping -c 1 " + host, (err, stdout) => {
        if (err) return res.status(500).send(err.message);
        res.send(stdout);
    });
});

// Code Flaw 4: Path Traversal Vulnerability
app.get('/api/files', (req, res) => {
    const filePath = req.query.filename;
    // Vulnerable: Reading file path directly from input without validation
    const content = fs.readFileSync('/tmp/uploads/' + filePath, 'utf8');
    res.send(content);
});

// Code Flaw 5: Insecure HTTP & Debug Mode Enabled
const DEBUG_MODE = true;
const API_ENDPOINT = "http://insecure-api-demo.internal/data";

module.exports = app;
