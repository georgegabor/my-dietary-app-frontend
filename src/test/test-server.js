// Server to send error responses
// Login works

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 8080;

// Endpoints
const AUTHENTICATION_URL = '/authenticate';
const COMPANY_URL = '/api/companies';
const ACCOUNT_URL = '/api/companies';
const PARTNER_URL = '/api/partners';
const PROJECT_URL = '/api/projects';
const NOSTRO_URL = '/nostros';

app.use(cors(), function (req, res, next) {
  setTimeout(next, 1000);
});

// NOSTRO
app.get(NOSTRO_URL, (req, res) => {
  res.sendFile(path.join(__dirname, '', 'nostro.json'));
});

// AUTHENTICATE
app.post(AUTHENTICATION_URL, (req, res) => {
  res.sendFile(path.join(__dirname, '', 'test-authentication.json'));
});

// 403 error
app.get(COMPANY_URL, (req, res) => {
  res.sendStatus(403);
});

// 400 error
app.post(COMPANY_URL, (req, res) => {
  res.status(400).json({
    errorMessage: 'Test error msg',
    detailedErrorMessage: 'Test detailed error msg',
  });
});

// 404 error
app.get(ACCOUNT_URL, (req, res) => {
  res.sendStatus(404);
});

// 500 error
app.get(PARTNER_URL, (req, res) => {
  res.sendStatus(500);
});

// 503 error
app.get(PROJECT_URL, (req, res) => {
  res.sendStatus(503);
});

app.listen(port, () => console.log(`Test server listening on port ${port}!`));
