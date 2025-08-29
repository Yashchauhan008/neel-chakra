import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MangroveStateMap() {
  const [statesData, setStatesData] = useState(null);
  const [mangroves, setMangroves] = useState(null);
  const [selectedState, setSelectedState] = useState("Maharashtra"); // ✅ Default to Mumbai
  const [mapType, setMapType] = useState("osm"); // 🟢 Toggle between osm/satellite

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
      {/* Dropdown + Toggle Controls */}
      <div style={{ 
          position: "absolute", 
          top: 10, 
          left: 10, 
          zIndex: 1000, 
          background: "#fff", 
          padding: "8px", 
          borderRadius: "8px" 
        }}>
        <label>Select State: </label>
        <select 
          value={selectedState} 
          onChange={(e) => setSelectedState(e.target.value)} 
          style={{ marginRight: "10px" }}
        >
          <option value="">-- Choose State --</option>
          <option value="Gujarat">Gujarat</option>
          <option value="Maharashtra">Maharashtra</option> {/* ✅ Default */}
          <option value="Goa">Goa</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Kerala">Kerala</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Odisha">Odisha</option>
          <option value="West Bengal">West Bengal</option>
        </select>

        {/* 🟢 Map Type Toggle */}
        <button onClick={() => setMapType(mapType === "osm" ? "satellite" : "osm")}>
          Switch to {mapType === "osm" ? "Satellite 🌍" : "OSM 🗺️"}
        </button>
      </div>

      {/* ✅ Default center = Mumbai */}
      <MapContainer center={[19.076, 72.8777]} zoom={10} style={{ height: "100%", width: "100%" }}>
        {/* 🟢 Conditional Tile Layer */}
        {mapType === "osm" ? (
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <TileLayer
            attribution='Tiles © Esri &mdash; Esri, i-cubed, USDA, USGS'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}

        {mangroves && <GeoJSON data={mangroves} style={mangroveStyle} />}
      </MapContainer>
    </div>
  );
}
