// server.js
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// HOD/department mapping
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

app.get("/", (req, res) => {
    res.json({ msg: "✅ Leave Backend Running Successfully!" });
});

app.post("/sendLeave", async (req, res) => {
    const { userType, name, dept, days, date, reason } = req.body;
    if (!name || !dept || !days || !date || !reason) {
        return res.status(400).json({ msg: "All fields required" });
    }

    // determine receiver
    let receiverEmail;
    if (userType === "NonTeaching" || userType === "HOD") {
        receiverEmail = "sayalarevathi@gmail.com"; // AO
    } else {
        receiverEmail = hodEmails[dept] || "sayalarevathi@gmail.com";
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
            port: Number(process.env.SMTP_PORT || 587),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: receiverEmail,
            subject: `Leave Request - ${name}`,
            text: `Name: ${name}\nDepartment: ${dept}\nUserType: ${userType}\nDays: ${days}\nDate: ${date}\nReason: ${reason}`,
        };

        await transporter.sendMail(mailOptions);
        return res.json({ msg: "Leave Report Sent!" });
    } catch (err) {
        console.error("Mail error:", err);
        return res.status(500).json({ msg: "Email Failed", error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
