const path = require('path');
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * handle requests for static files
 */

app.use(express.static(path.join(__dirname, '../client')));

// catch-all route handler for any requests to an unknown route
app.use('*', (req, res) => {
    return res.sendStatus(404);
});

/**
 * start server
 */
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
