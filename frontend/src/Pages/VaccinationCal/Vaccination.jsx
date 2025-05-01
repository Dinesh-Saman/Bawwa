import React, { useState } from "react";
import moment from "moment";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Vaccination.css"; // Import the external CSS file

const Vaccination = () => {
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [vaccinationSchedule, setVaccinationSchedule] = useState([]);
  const [errors, setErrors] = useState("");

  const schedules = {
    dog: [
      { name: "DHPP (Distemper, Hepatitis, Parvo, Parainfluenza)", weeks: 6 },
      { name: "DHPP Booster", weeks: 10 },
      { name: "Rabies", weeks: 12 },
      { name: "Leptospirosis", weeks: 14 },
      { name: "Annual Booster", weeks: 52 },
    ],
    cat: [
      { name: "FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)", weeks: 6 },
      { name: "FVRCP Booster", weeks: 10 },
      { name: "Rabies", weeks: 12 },
      { name: "FeLV (Feline Leukemia)", weeks: 14 },
      { name: "Annual Booster", weeks: 52 },
    ],
  };

  const validateBirthdate = () => {
    if (!birthdate) {
      setErrors("Please enter your pet's birthdate.");
      return false;
    }

    const birthMoment = moment(birthdate, "YYYY-MM-DD");
    const today = moment().startOf("day");

    if (birthMoment.isAfter(today)) {
      setErrors("Birthdate cannot be in the future.");
      return false;
    }

    const minAllowedBirthdate = today.clone().subtract(6, "weeks");
    if (birthMoment.isAfter(minAllowedBirthdate)) {
      setErrors("Pet must be at least 6 weeks old to generate a vaccination schedule.");
      return false;
    }

    setErrors("");
    return true;
  };

  const calculateVaccinationSchedule = () => {
    if (!petType) {
      setErrors("Please select a pet type.");
      return;
    }

    if (!validateBirthdate()) return;

    const birthMoment = moment(birthdate, "YYYY-MM-DD");
    const now = moment();

    const schedule = schedules[petType].map((vaccine) => {
      const vaccineDate = birthMoment.clone().add(vaccine.weeks, "weeks");
      return {
        ...vaccine,
        date: vaccineDate.format("YYYY-MM-DD"),
        status: vaccineDate.isBefore(now) ? "Completed" : "Upcoming",
      };
    });

    setVaccinationSchedule(schedule);
  };

  const downloadPDF = () => {
    const input = document.getElementById("pdf-schedule"); // Target only the schedule
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.text(`Vaccination Schedule for ${petName}`, 10, 10);
      pdf.addImage(imgData, "PNG", 10, 20, 180, 0);
      pdf.save(`${petName}_Vaccination_Schedule.pdf`);
    });
  };

  return (
    <div className="vaccination-container">
      <h2 className="title">Pet Vaccination Calculator</h2>

      <div className="form-container">
        <div className="input-group">
          <label>Pet Name:</label>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="Enter pet's name"
          />
        </div>

        <div className="input-group">
          <label>Pet Type:</label>
          <select value={petType} onChange={(e) => setPetType(e.target.value)}>
            <option value="">Select Pet Type</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
          </select>
        </div>

        <div className="input-group">
          <label>Pet's Birthdate:</label>
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            max={moment().format("YYYY-MM-DD")} // Prevents selecting future dates
            style={{marginBottom:'10px'}}
          />
          {errors && <p className="error-text">{errors}</p>}
        </div>

        <button className="calculate-btn" onClick={calculateVaccinationSchedule}>
          Calculate Vaccination Schedule
        </button>
      </div>

      {/* Vaccination Schedule (hidden button inside a separate div) */}
      {vaccinationSchedule.length > 0 && (
        <div className="schedule-container">
          <div id="pdf-schedule">
            <h3>Vaccination Schedule</h3>
            <ul>
              {vaccinationSchedule.map((vaccine, index) => (
                <li key={index} className={vaccine.status === "Completed" ? "completed" : "upcoming"}>
                  <strong>{vaccine.name}</strong> - {vaccine.date} -{" "}
                  <span className={vaccine.status === "Completed" ? "text-gray" : "text-green"}>
                    {vaccine.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <button className="download-btn" onClick={downloadPDF}>
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default Vaccination;
