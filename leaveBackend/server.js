// ✅ Leave Management Backend - Brevo API + Role-based Routing
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Config
const PORT = process.env.PORT || 10000;
const BREVO_API_KEY = process.env.BREVO_API_KEY;

// ✅ Department → HOD Email Mapping
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

// ✅ Root test route
app.get("/", (req, res) => {
    res.send("✅ Leave Management API is running...");
});

// ✅ Leave Submission Route
app.post("/sendLeave", async (req, res) => {
    console.log("📩 Incoming leave request:", req.body);

    const { userType, name, dept, days, date, reason } = req.body;

    if (!name || !dept || !days || !date || !reason) {
        return res.status(400).json({ msg: "❌ Missing fields" });
    }

    // ✅ Determine Receiver
    let receiverEmail;
    if (userType === "HOD" || userType === "NonTeaching") {
        receiverEmail = "aorcee@gmail.com"; // AO Email
    } else {
        receiverEmail = hodEmails[dept] || "sayalarevathi50@gmail.com"; // fallback
    }

    // ✅ Construct Email
    const emailBody = `
    <h2>Leave Application</h2>
    <p><strong>From:</strong> ${name}</p>
    <p><strong>Department:</strong> ${dept}</p>
    <p><strong>User Type:</strong> ${userType}</p>
    <p><strong>Days:</strong> ${days}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Reason:</strong> ${reason}</p>
  `;

    try {
        // ✅ Send email via Brevo API
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                accept: "application/json",
                "api-key": BREVO_API_KEY,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                sender: { email: "sayalarevathi50@gmail.com", name: "RCEE Leave System" },
                to: [{ email: receiverEmail }],
                subject: `Leave Request - ${name}`,
                htmlContent: emailBody,
            }),
        });

        if (response.ok) {
            console.log(`✅ Email sent successfully to ${receiverEmail}`);
            res.json({ msg: "✅ Leave Report Sent Successfully!" });
        } else {
            const error = await response.json();
            console.error("❌ Brevo API Error:", error);
            res.status(500).json({ msg: "❌ Failed to send email", error });
        }
    } catch (err) {
        console.error("❌ Request Error:", err);
        res.status(500).json({ msg: "❌ Internal Server Error", error: err.message });
    }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
