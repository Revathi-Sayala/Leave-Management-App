// server.js
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ============================
// 🔹 Department → HOD Emails
// ============================
const hodEmails = {
    CSE: "sayalarevathi@gmail.com",
    AIML: "sayalarevathi50@gmail.com",
    AIDS: "sayalarevathi50@gmail.com",
    Cyber: "sayalasrinagakarthik@gmail.com",
    IOT: "sayalasrinagakarthik@gmail.com",
    EEE: "pillapuli90@gmail.com",
    ECE: "pillapuli90@gmail.com",
    CIVIL: "sayalarevathi50@gmail.com",
    Mechanical: "pillapuli@gmail.com",
};

// ============================
// ✅ Root Health Check Route
// ============================
app.get("/", (req, res) => {
    res.json({ msg: "✅ Leave Backend Running Successfully!" });
});

// ============================
// ✉️ Leave Submission Route
// ============================
app.post("/sendLeave", async (req, res) => {
    try {
        const { userType, name, dept, days, date, reason } = req.body;

        if (!name || !dept || !days || !date || !reason) {
            return res.status(400).json({ msg: "⚠️ All fields are required" });
        }

        // Determine recipient email
        let receiverEmail = "";
        if (userType === "NonTeaching" || userType === "HOD") {
            receiverEmail = "sayalarevathi@gmail.com"; // AO email
        } else {
            receiverEmail = hodEmails[dept] || "sayalarevathi@gmail.com";
        }

        // ============================
        // 🔹 Setup Brevo SMTP Transport
        // ============================
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"RCEE Leave Portal" <${process.env.EMAIL_USER}>`,
            to: receiverEmail,
            subject: `Leave Request - ${name}`,
            text: `
Name: ${name}
Department: ${dept}
User Type: ${userType}
Days of Leave: ${days}
Date: ${date}
Reason: ${reason}
      `,
        };

        // Send mail
        await transporter.sendMail(mailOptions);

        console.log("✅ Mail sent successfully!");
        res.json({ msg: "✅ Leave Report Sent Successfully!" });

    } catch (error) {
        console.error("❌ Mail sending failed:", error);
        res.status(500).json({ msg: "❌ Email sending failed", error: error.message });
    }
});

// ============================
// 🌐 Server Startup
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
