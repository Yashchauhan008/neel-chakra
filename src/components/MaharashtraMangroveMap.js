// src/components/MaharashtraMangroveMap.js

import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SidePanel from "./SidePanel";
import { maharashtraDistrictsGeoJSON } from "../data/maharashtraDistricts-full";

// CHANGE: Import the compatibility CSS and JS for marker icons
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

export default function MaharashtraMangroveMap() {
  const [mangroves, setMangroves] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [mapType, setMapType] = useState("osm");
  const [selectedDropdownValue, setSelectedDropdownValue] = useState("");
  const [mapMessage, setMapMessage] = useState("");
  // CHANGE: Add state to store the center position for the marker
  const [markerPosition, setMarkerPosition] = useState(null);
  const mapRef = useRef();

  const handleDistrictSelect = (districtName) => {
    setMangroves(null);
    setSelectedDistrict(null);
    setMapMessage("Loading mangrove data...");
    // CHANGE: Clear the previous marker
    setMarkerPosition(null);

    const districtFeature = maharashtraDistrictsGeoJSON.features.find(
      (f) => f.properties.district === districtName
    );

    if (districtFeature) {
      setSelectedDropdownValue(districtName);
      setSelectedDistrict(districtFeature);

      const layer = L.geoJSON(districtFeature);
      const bounds = layer.getBounds();
      
      // CHANGE: Calculate the center of the district for the marker
      const center = bounds.getCenter();
      setMarkerPosition([center.lat, center.lng]);

      mapRef.current.fitBounds(bounds);
      fetchMangroves(bounds);
    }
  };

  const fetchMangroves = async (bounds) => {
    const query = `
      [out:json][timeout:25];
      (
        way["natural"="wetland"]["wetland"="mangrove"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
      );
      out body;
      >;
      out skel qt;
    `;
    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query );

    try {
      const res = await fetch(url);
      const data = await res.json();
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

      if (features.length > 0) {
        setMangroves({ type: "FeatureCollection", features });
        setMapMessage("");
      } else {
        setMangroves(null);
        setMapMessage("No mangrove forests found in this district.");
      }
    } catch (err) {
      console.error("Overpass API error:", err);
      setMangroves(null);
      setMapMessage("Could not fetch data. Please try again.");
    }
  };

  const mangroveStyle = { color: "green", weight: 2, fillOpacity: 0.6 };

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 50,
          zIndex: 1000,
          background: "#fff",
          padding: "8px",
          borderRadius: "8px",
        }}
      >
        <label style={{ marginRight: "8px" }}>Select District:</label>
        <select
          value={selectedDropdownValue}
          onChange={(e) => handleDistrictSelect(e.target.value)}
        >
          <option value="" disabled>-- Choose a District --</option>
          {maharashtraDistrictsGeoJSON.features
            .map((d) => d.properties.district)
            .sort()
            .map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
        <button
          onClick={() => setMapType(mapType === "osm" ? "satellite" : "osm")}
          style={{ marginLeft: "10px" }}
        >
          Switch to {mapType === "osm" ? "Satellite" : "OSM"}
        </button>
      </div>

      {mapMessage && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white', padding: '15px 25px', borderRadius: '10px',
          zIndex: 1000, fontSize: '1.2em', textAlign: 'center'
        }}>
          {mapMessage}
        </div>
      )}

      <MapContainer
        center={[19.7515, 75.7139]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        {mapType === "osm" ? (
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
         ) : (
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
         )}

        {/* CHANGE: The blue district polygon has been replaced with a single Marker */}
        {markerPosition && (
          <Marker position={markerPosition}>
            <Popup>
              {selectedDropdownValue} District
            </Popup>
          </Marker>
        )}

        {mangroves && <GeoJSON data={mangroves} style={mangroveStyle} />}
      </MapContainer>

      <SidePanel
        district={selectedDistrict}
        onClose={() => {
          setSelectedDistrict(null);
          setSelectedDropdownValue("");
          setMangroves(null);
          setMapMessage("");
          // CHANGE: Clear the marker when the panel is closed
          setMarkerPosition(null);
        }}
      />
    </div>
  );
}
