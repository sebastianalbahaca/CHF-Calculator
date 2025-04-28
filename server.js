const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from root directory
app.use(express.static('.'));

// Explicitly serve locales directory
app.use('/locales', express.static(path.join(__dirname, 'locales')));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});