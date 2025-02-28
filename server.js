require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'Outlook', // Use Outlook for your email provider
    auth: {
        user: process.env.EMAIL,  // Load email from .env file
        pass: process.env.PASSWORD // Load password from .env file
    }
});

// Endpoint to log and email the data
app.post('/log', (req, res) => {
    const logData = req.body; // Received data from frontend

    // Format the log data for the email
    const emailContent = `
        New visitor data logged:
        - IP Address: ${logData.ipAddress}
        - User Agent: ${logData.userAgent}
        - Screen Resolution: ${logData.screen}
        - Timestamp: ${logData.timestamp}
    `;

    // Nodemailer email options
    const mailOptions = {
        from: process.env.EMAIL,
        to: 'help@lernhelp.cc',
        subject: 'Pedo caught lacking in 8K 240fps 300hz with the Cannon EQS',
        text: emailContent // Email body containing the logged data
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            res.status(500).send("Failed to send email");
        } else {
            console.log("Email sent:", info.response);
            res.status(200).send("Data logged and emailed successfully");
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

