// src/components/SidePanel.js

import React from "react";

const SidePanel = ({ district, onClose }) => {
  // If no district is selected, the panel is not rendered.
  if (!district) {
    return null;
  }

  // Placeholder data for the selected district.
  // In the future, this could be fetched from your backend API.
  const districtData = {
    name: district.properties.district,
    pastData: "1,200 ha (in 2010)",
    presentData: "1,050 ha (in 2024)",
    futureProjection: "980 ha (by 2030, without intervention)",
    adoptionLink: "#",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "300px",
        height: "100%",
        backgroundColor: "white",
        zIndex: 1001, // Ensures it's on top of the map
        padding: "20px",
        boxShadow: "-2px 0 5px rgba(0,0,0,0.2)",
        overflowY: "auto",
        transition: "transform 0.3s ease-in-out",
        transform: "translateX(0)",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          border: "none",
          background: "transparent",
          fontSize: "1.5rem",
          cursor: "pointer",
        }}
      >
        &times;
      </button>
      <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
        {districtData.name} District
      </h2>
      <div>
        <h4>Mangrove Coverage Details</h4>
        <p>
          <strong>Past (2010):</strong> {districtData.pastData}
        </p>
        <p>
          <strong>Present (2024):</strong> {districtData.presentData}
        </p>
        <p>
          <strong>Future Projection:</strong> {districtData.futureProjection}
        </p>
        <button
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginTop: "20px",
            cursor: "pointer",
          }}
        >
          Adopt a Patch in {districtData.name}
        </button>
      </div>
    </div>
  );
};

export default SidePanel;
