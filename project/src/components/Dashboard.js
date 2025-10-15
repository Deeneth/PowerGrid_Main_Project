import React, { useState } from "react";

function Dashboard() {
  const [formData, setFormData] = useState({
    budget: 10,
    location: "Delhi",
    tower_type: "132kV",
    substation_type: "AIS",
    terrain: "Plain",
    tax: 18,
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPrediction(null);
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.predictions) setPrediction(data.predictions);
      else setError(data.error || "Prediction failed");
    } catch {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>POWERGRID Material Demand Forecasting</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Budget (Cr):
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            min="1"
            max="100"
          />
        </label>
        <label>
          Location:
          <select name="location" value={formData.location} onChange={handleChange}>
            <option>Delhi</option>
            <option>Gujarat</option>
            <option>Karnataka</option>
            <option>Kerala</option>
            <option>Madhya Pradesh</option>
            <option>Maharashtra</option>
            <option>Odisha</option>
            <option>Rajasthan</option>
            <option>Tamil Nadu</option>
            <option>Telangana</option>
          </select>
        </label>
        <label>
          Tower Type:
          <select name="tower_type" value={formData.tower_type} onChange={handleChange}>
            <option>132kV</option>
            <option>220kV</option>
            <option>400kV</option>
          </select>
        </label>
        <label>
          Substation Type:
          <select name="substation_type" value={formData.substation_type} onChange={handleChange}>
            <option>AIS</option>
            <option>GIS</option>
          </select>
        </label>
        <label>
          Terrain:
          <select name="terrain" value={formData.terrain} onChange={handleChange}>
            <option>Coastal</option>
            <option>Hilly</option>
            <option>Mountain</option>
            <option>Plain</option>
          </select>
        </label>
        <label>
          Tax (%):
          <input
            type="number"
            name="tax"
            value={formData.tax}
            onChange={handleChange}
            min="0"
            max="50"
          />
        </label>
        <button type="submit">Predict Materials</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {prediction && (
        <div className="prediction-result">
          <h3>Predicted Material Requirements:</h3>
          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(prediction).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
