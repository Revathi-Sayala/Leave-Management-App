import React, { useState } from "react";
import axios from "axios";
import "./App.css";

import studentImg from "./images/student.webp";
import teacherImg from "./images/Faculty.jpeg";
import nonteachImg from "./images/N-T staff.jpeg";
import hodImg from "./images/HOD.jpeg";

// ✅ Backend URL (Render deployed server)
const API = "https://leave-management-app-2br0.onrender.com";

function App() {
  const [page, setPage] = useState("role");
  const [roll, setRoll] = useState("");
  const [userType, setUserType] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [closingPopup, setClosingPopup] = useState(false);
  const [form, setForm] = useState({
    name: "",
    dept: "",
    days: "",
    date: "",
    reason: "",
  });

  // ------------------ LOGIN HANDLER ------------------
  const handleLogin = () => {
    if (userType === "Student" && !roll.includes("@rcee.ac.in")) {
      alert("Login Denied - invalid domain");
      return;
    }
    setPage("form");
  };

  // ------------------ RIPPLE EFFECT ------------------
  const ripple = (e) => {
    const rect = e.target.getBoundingClientRect();
    e.target.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.target.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  // ------------------ SUBMIT FORM ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, dept, days, date, reason } = form;

    if (!name || !dept || !days || !date || !reason) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(`${API}/sendLeave`, {
        userType,
        ...form,
      });
      if (res.status === 200) {
        setShowPopup(true);
      } else {
        alert("Failed to send leave request.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Server error — could not send. Please check backend.");
    }
  };

  // ------------------ CLOSE POPUP ------------------
  const handleClosePopup = () => {
    setClosingPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setClosingPopup(false);
      setPage("role");
      setForm({ name: "", dept: "", days: "", date: "", reason: "" });
    }, 600);
  };

  // ------------------ LOGIN PAGE ------------------
  if (page === "login")
    return (
      <>
        <h1 className="app-title">RCEE Leave Management System</h1>
        <div className="container">
          <h2>Login</h2>
          <input
            placeholder="Enter your email"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      </>
    );

  // ------------------ ROLE SELECTION ------------------
  if (page === "role")
    return (
      <>
        <h1 className="app-title">RCEE Leave Management System</h1>
        <div className="container">
          <h2>Select Your Role</h2>
          <div className="role-buttons">
            <button
              className="role-button"
              onClick={() => {
                setUserType("Student");
                setPage("login");
              }}
            >
              <img src={studentImg} className="icon" alt="" /> Student
            </button>

            <button
              className="role-button"
              onClick={() => {
                setUserType("Teaching");
                setPage("form");
              }}
            >
              <img src={teacherImg} className="icon" alt="" /> Teaching Faculty
            </button>

            <button
              className="role-button"
              onClick={() => {
                setUserType("NonTeaching");
                setPage("form");
              }}
            >
              <img src={nonteachImg} className="icon" alt="" /> Non-Teaching
            </button>

            <button
              className="role-button"
              onClick={() => {
                setUserType("HOD");
                setPage("form");
              }}
            >
              <img src={hodImg} className="icon" alt="" /> HOD
            </button>
          </div>
        </div>
      </>
    );

  // ------------------ FORM PAGE ------------------
  return (
    <>
      <h1 className="app-title">RCEE Leave Management System</h1>
      <div className={`container ${showPopup ? "blur" : ""}`}>
        <h2>Leave Report Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-box">
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-box">
            <select
              value={form.dept}
              onChange={(e) => setForm({ ...form, dept: e.target.value })}
            >
              <option value="" disabled>
                Select Department
              </option>
              <option value="CSE">CSE</option>
              <option value="AIML">AIML</option>
              <option value="AIDS">AIDS</option>
              <option value="Cyber">Cyber</option>
              <option value="IOT">IOT</option>
              <option value="EEE">EEE</option>
              <option value="ECE">ECE</option>
              <option value="CIVIL">CIVIL</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>

          <div className="form-box">
            <input
              placeholder="Number of days requested"
              type="number"
              value={form.days}
              onChange={(e) => setForm({ ...form, days: e.target.value })}
            />
          </div>

          <div className="form-box">
            <input
              placeholder="Select date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className="form-box">
            <textarea
              placeholder="Describe the reason"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            ></textarea>
          </div>

          <button onMouseDown={ripple} type="submit">
            Submit Leave
          </button>
        </form>
      </div>

      {/* ✅ POPUP */}
      {showPopup && (
        <div className={`popup-overlay ${closingPopup ? "fade-out" : ""}`}>
          <div className="popup-box">
            <span className="popup-emoji">🥳</span>
            <h3>Your response has been sent!</h3>
            <p>Enjoy your holiday 🎉</p>
            <button className="close-btn" onClick={handleClosePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
