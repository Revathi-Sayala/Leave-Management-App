const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Department → HOD email mapping
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

// Root test route
app.get("/", (req, res) => {
    res.json({ msg: "✅ Leave Backend Running Successfully!" });
});

// Leave submit route
app.post("/sendLeave", async (req, res) => {
    const { userType, name, dept, days, date, reason } = req.body;

    if (!name || !dept || !days || !date || !reason) {
        return res.status(400).json({ msg: "⚠️ All fields must be entered" });
    }

    let receiverEmail;
    if (userType === "NonTeaching" || userType === "HOD") {
        receiverEmail = "sayalarevathi@gmail.com";
    } else {
        receiverEmail = hodEmails[dept] || "sayalarevathi@gmail.com";
    }

    try {
        // ✅ Send email using Brevo API
        await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: { name: "RCEE Leave System", email: "noreply@rcee.ac.in" },
                to: [{ email: receiverEmail }],
                subject: `Leave Request - ${name}`,
                htmlContent: `
          <h3>Leave Request Details</h3>
          <p><b>Name:</b> ${name}</p>
          <p><b>Department:</b> ${dept}</p>
          <p><b>User Type:</b> ${userType}</p>
          <p><b>Days of Leave:</b> ${days}</p>
          <p><b>Date:</b> ${date}</p>
          <p><b>Reason:</b> ${reason}</p>
        `,
            },
            {
                headers: {
                    "accept": "application/json",
                    "api-key": process.env.BREVO_API_KEY, // ✅ your key
                    "content-type": "application/json",
                },
            }
        );

        res.json({ msg: "✅ Leave Report Sent Successfully!" });
    } catch (error) {
        console.error("Mail error:", error.response?.data || error.message);
        res.status(500).json({ msg: "❌ Email failed to send", error: error.message });
    }
});

// ✅ Dynamic PORT for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
