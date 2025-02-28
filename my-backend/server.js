require('dotenv').config({ path: './email.env' });
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(express.json());

// Set up Nodemailer using variables from email.env
const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

// Endpoint to handle logging and email
app.post('/log', (req, res) => {
    const logData = req.body;
    const emailContent = `
        Visitor Data:
        - IP Address: ${logData.ipAddress}
        - User Agent: ${logData.userAgent}
        - Screen Resolution: ${logData.screen}
        - Timestamp: ${logData.timestamp}
        
    `;

    const mailOptions = {
        from: process.env.EMAIL,
        to: 'help@lernhelp.cc',
        subject: 'Visitor Data Logged',
        text: emailContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            res.status(500).send("Email sending failed");
        } else {
            console.log("Email sent:", info.response);
            res.status(200).send("Data logged and emailed successfully");
        }
    });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
}
app.post('/log', (req, res) => {
    const logData = req.body; // Receive data from the frontend

    // Log the information to the console
    console.log(`Info logged! IP: ${logData.ipAddress} | User Agent: ${logData.userAgent} | Screen Res: ${logData.screen}`);

    // Send the logged data back to the frontend as a response
    res.status(200).json(logData);
});

