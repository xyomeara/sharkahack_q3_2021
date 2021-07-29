const path = require('path');
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '../dist');

/**
 * handle requests for static files
 */

app.use(express.static(DIST_DIR));

app.get('/*', function (req, res) {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
});

/**
 * start server
 */
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
