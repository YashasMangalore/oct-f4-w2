import React, { useState } from "react";
import "./PincodeLookup.css"; // Import the CSS file

const PincodeLookup = () => {
  const [pincode, setPincode] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [showFilter, setShowFilter] = useState(false); // State to control filter visibility

  const handleFetchData = async () => {
    if (pincode.length !== 6 || isNaN(pincode)) {
      setError("Please enter a valid 6-digit postal code.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const result = await response.json();

      if (result[0].Status !== "Success") {
        setError(result[0].Message || "Error fetching data.");
        setData(null);
      } else {
        setData(result[0].PostOffice);
        setShowFilter(true); // Show filter input after fetching data
      }
    } catch (err) {
      setError("An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data
    ? data.filter((item) =>
        item.Name.toLowerCase().includes(filter.toLowerCase())
      )
    : [];

  return (
    <div className="lookup-container">
      <h1>Enter Pincode</h1>
      <input
        type="text"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
        placeholder="Enter 6-digit Pincode"
        className="input-box"
      />
      <button className="lookup-button" onClick={handleFetchData}>
        Lookup
      </button>
      {loading && <div className="loader"></div>}
      {error && <div className="error-message">{error}</div>}
      {filteredData.length === 0 && !loading && data && (
        <div>Couldn’t find the postal data you’re looking for…</div>
      )}
      {showFilter && ( // Render filter input if data has been fetched
        <div>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by Name"
            className="filter-input"
          />
        </div>
      )}
      <div className="result-container">
        {filteredData.map((item, index) => (
          <div key={index} className="result-box">
            <h3>{item.Name}</h3>
            <p>Pincode: {item.Pincode}</p>
            <p>District: {item.District}</p>
            <p>State: {item.State}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PincodeLookup;
