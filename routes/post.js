import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { pool } from "../routes/pool.js"; // Import the pool

dotenv.config();

const app = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const appp = initializeApp(firebaseConfig);

// Initialize analytics only if supported (i.e. in a browser context)
isSupported().then((supported) => {
    if (supported) {
        getAnalytics(appp);
    }
});

const db = getFirestore(appp);

// Test connection to Firestore
const testConnection = async () => {
    try {
        const testDocRef = doc(db, "testCollection", "testConnection");
        await setDoc(testDocRef, {
            timestamp: new Date().toISOString(),
            message: "Connection successful",
        });
        console.log("Successfully connected to Firestore");
    } catch (error) {
        console.error("Failed to connect to Firestore:", error);
    }
};

testConnection();

// Update the /test endpoint
app.post("/test", async (req, res) => {
    const { title, name, createdDate, lastUpdated, status, auditTrail } = req.body;

    const id = "yourCollectionName";
    try {
        // Write data to Firestore
        const docRef = doc(db, "yourCollectionName", id);
        await setDoc(docRef, {
            title,
            name,
            createdDate,
            lastUpdated,
            status,
            auditTrail,
        });

        res.status(200).json({ message: "Record added successfully" });
    } catch (error) {
        console.error("Failed to add record to Firestore:", error);
        res.status(500).json({ error: "Failed to add record", details: error.message });
    }
}); 

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

const generateTableRow = (label, value = false) => `
    <div class="email-section">
     <span class="email-label">${label}</span>
    <span class="email-value">${value || "N/A"}</span>
       </div >
 `;

const constructEmailContent = (data) => {
    const {
        PageUrl,
        subject,
        support,
        projectCato,
        name,
        email,
        message,
        Timestamp,
        additionalFields,
    } = data;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }

        .email-container {
            max-width: 650px;
            margin: 40px auto;
            background: rgb(55, 58, 61) !important;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .email-header {
            background-color: rgb(51, 53, 56) !important;
            color: #ffffff !important;
            text-align: center;
            padding: 30px 20px;
            font-size: 28px;
            font-weight: 600;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #333;
        }

        .email-body {
            padding: 30px;
        }

        .email-section {
            margin-bottom: 25px;
        }

        .email-label {
            font-size: 15px;
            color: #bdbdbd !important;
            font-weight: 600;
            margin-bottom: 8px;
            display: block;
        }

        .email-value {
            font-size: 17px;
            color:#ffffff !important;
            word-break: break-word;
        }

        .email-value a {
            color: #81d4fa;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .email-value a:hover {
            color: #4fc3f7;
        }

        .divider {
            border-top: 1px solid #333;
            margin: 30px 0;
        }

        .email-footer {
            text-align: center;
            padding: 20px;
            font-size: 13px;
            color: #9e9e9e !important;
            background-color: rgb(55, 58, 61) !important;
            border-top: 2px solid #222222;
        }

        .email-footer a {
            color: #81d4fa;
            text-decoration: none;
        }

        .email-footer a:hover {
            color: #4fc3f7;
        }

        .Addi-label {
            font-size: 25px;
            color: #ffffff !important;
            font-weight: 600;
            margin-bottom: 8px;
            display: block;
        }

        @media screen and (max-width: 600px) {
            .email-container {
                width: 95%;
                margin: 20px auto;
            }

            .email-header {
                font-size: 24px;
                padding: 20px 15px;
            }

            .email-body {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            New Contact Form Submission
        </div>
        <div class="email-body">
            ${generateTableRow("Subject", subject, true)} ${support ? generateTableRow("Support", support) : ""} ${projectCato ? generateTableRow("Project Category", projectCato, true) : ""} ${generateTableRow("Name", name)} ${generateTableRow("Email", `
            <a href="mailto:${email}" class="email-link">${email}</a>`, true)} ${generateTableRow("Message", message)} ${generateTableRow("Timestamp", Timestamp, true)} ${generateTableRow("Page URL", `
            <a href="${PageUrl}" class="email-link">${PageUrl}</a>`)} ${Object.keys(additionalFields).length ? `
            <h3 class="Addi-label">
                Additional Information
            </h3>
            ${Object.entries(additionalFields).map(([key, value]) => generateTableRow(key, value)).join("")} ` : ""}
            <p class="email-footer">
                This message was sent from the contact form on your website.
            </p>
        </div>
</body>
</html>
  `;
};

function generateTicketNumber() {
    return 'T' + Math.floor(Math.random() * 1000000000);
}

app.post("/SubmitForm", async (req, res) => {
    const allowedOrigin = "https://mbktechstudio.com";
    const referer = req.headers.referer;

    // Determine if the environment is local
    const isLocalEnv = process.env.localenv === "true";

    // Validate referer
    if (
        !referer ||
        (!referer.includes(allowedOrigin) &&
            !referer.includes(".mbktechstudio.com") &&
            !(isLocalEnv && referer.includes("http://localhost:3000")))
    ) {
        console.log("Invalid referer:", referer);
        return res.status(403).json({ error: "Forbidden. Invalid referer." });
    }

    console.log("Received request to /SubmitForm");

    const {
        UserName: name,
        Email: email,
        Subject: subject,
        Message: message,
        PageUrl,
        Timestamp,
        support,
        projectCato,
        ...additionalFields
    } = req.body;

    // Validate required fields
    const missingFields = ["UserName", "Email", "Subject", "Message"].filter(
        (field) => !req.body[field]
    );

    if (missingFields.length > 0) {
        console.log("Missing required fields:", missingFields);
        return res.status(400).json({
            error: "Invalid request. Missing required fields.",
            missingFields,
        });
    }

    let TicketNumber = "";
    if (subject === "Support") {
        TicketNumber = generateTicketNumber();
        let response = await fetch(`http://localhost:3000/api/tickets/${TicketNumber}`);
        while (response.status !== 404) {
            TicketNumber = generateTicketNumber();
            response = await fetch(`http://localhost:3000/api/tickets/${TicketNumber}`);
        }

        const ticketData = {
            ticketno: TicketNumber,
            name,
            title: subject + ' / ' + support + ' / ' + projectCato,
            status: "Pending",
            createdDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            auditTrail: [
                {
                    type: "status",
                    action: "Ticket Created",
                    timestamp: new Date().toISOString(),
                },
            ],
        };

        try {
            const query = `
            INSERT INTO "Ticket" (ticketno, name, title, status, "createdDate", "lastUpdated", "auditTrail")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
            `;
            const values = [
                ticketData.ticketno,
                ticketData.name,
                ticketData.title,
                ticketData.status,
                ticketData.createdDate,
                ticketData.lastUpdated,
                JSON.stringify(ticketData.auditTrail), // Convert array to JSON string for JSONB
            ];

            const result = await pool.query(query, values);
            console.log("Ticket added to database:", result.rows[0]);
        } catch (err) {
            console.error("Error adding ticket to database:", err);
        }
    }

    if (TicketNumber) {
        additionalFields.TicketNumber = TicketNumber;
    }

    const contentBody = constructEmailContent({
        PageUrl,
        subject,
        support,
        projectCato,
        name,
        email,
        message,
        Timestamp,
        additionalFields,
    });
    
    try {
        // Send the email
        const mailOptions = {
            from: `<${email}>`,
            to: "support@mbktechstudio.com",
            subject: "New message from contact form",
            html: contentBody,
        };

        // console.log("Sending email with options:", contentBody);
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info);

        if (subject === "Support") {
            res.status(200).json({ message: "Email sent successfully", info, TN: TicketNumber });
        }
        else {
            res.status(200).json({ message: "Email sent successfully", info });
        }

    } catch (error) {
        console.error("Failed to send email:", error);
        res
            .status(500)
            .json({ error: "Failed to send email", details: error.message });
    }
});

export default app;