import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MangroveStateMap() {
  const [statesData, setStatesData] = useState(null);
  const [mangroves, setMangroves] = useState(null);
  const [selectedState, setSelectedState] = useState("Gujarat");

  // Load India states GeoJSON (only for bbox, not shown)
  useEffect(() => {
    fetch("/india_states_bbox.geojson")
      .then((res) => res.json())
      .then((data) => setStatesData(data));
  }, []);

  // Fetch mangroves when state changes
  useEffect(() => {
    if (!statesData || !selectedState) return;

    const feature = statesData.features.find(
      (f) => f.properties.name.toLowerCase() === selectedState.toLowerCase()
    );

    if (feature) {
      const coords = feature.geometry.coordinates[0];
      const lons = coords.map((c) => c[0]);
      const lats = coords.map((c) => c[1]);
      const south = Math.min(...lats);
      const west = Math.min(...lons);
      const north = Math.max(...lats);
      const east = Math.max(...lons);

      fetchMangroves(south, west, north, east);
    }
  }, [selectedState, statesData]);

  // Function to fetch mangroves
  const fetchMangroves = async (south, west, north, east) => {
    const query = `
      [out:json][timeout:25];
      (
        way["natural"="wetland"]["wetland"="mangrove"](${south},${west},${north},${east});
      );
      out body;
      >;
      out skel qt;
    `;
    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.elements || data.elements.length === 0) {
        console.warn("No mangroves in Overpass, using backup...");
        // fallback to local backup
        fetch("/mangroves_india.geojson")
          .then((res) => res.json())
          .then(setMangroves);
        return;
      }

      const features = [];
      const nodes = {};

      data.elements.forEach((el) => {
        if (el.type === "node") nodes[el.id] = [el.lon, el.lat];
      });

      data.elements.forEach((el) => {
        if (el.type === "way" && el.nodes) {
          const coords = el.nodes.map((n) => nodes[n]).filter(Boolean);
          if (coords.length > 3) {
            features.push({
              type: "Feature",
              properties: { id: el.id, type: "Mangrove" },
              geometry: { type: "Polygon", coordinates: [coords] },
            });
          }
        }
      });

      setMangroves({ type: "FeatureCollection", features });
    } catch (err) {
      console.error("Overpass error:", err);
      // fallback
      fetch("/mangroves_india.geojson")
        .then((res) => res.json())
        .then(setMangroves);
    }
  };

  const mangroveStyle = {
    color: "green",
    weight: 2,
    fillOpacity: 0.4,
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {/* Dropdown Selector */}
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1000, background: "#fff", padding: "5px" }}>
        <label>Select State: </label>
        <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
          <option value="">-- Choose State --</option>
          <option value="Gujarat">Gujarat</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Goa">Goa</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Kerala">Kerala</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Odisha">Odisha</option>
          <option value="West Bengal">West Bengal</option>
        </select>
      </div>

      <MapContainer center={[22.5, 80]} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* ✅ Only green mangroves drawn */}
        {mangroves && <GeoJSON data={mangroves} style={mangroveStyle} />}
      </MapContainer>
    </div>
  );
}
