// src/components/MaharashtraMangroveMap.js

import React, { useState, useRef, useEffect, useCallback } from "react"; // Import useCallback
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SidePanel from "./SidePanel";
import { maharashtraDistrictsGeoJSON } from "../data/maharashtraDistricts-full";

import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

export default function MaharashtraMangroveMap() {
  const [mangroves, setMangroves] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [mapType, setMapType] = useState("osm");
  const [selectedDropdownValue, setSelectedDropdownValue] = useState("");
  const [mapMessage, setMapMessage] = useState("");
  const mapRef = useRef();

  const fetchMangroves = async (bounds) => {
    const query = `[out:json][timeout:25];(way["natural"="wetland"]["wetland"="mangrove"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}););out body;>;out skel qt;`;
    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query );
    try {
      const res = await fetch(url);
      const data = await res.json();
      const features = [];
      const nodes = {};
      data.elements.forEach((el) => { if (el.type === "node") nodes[el.id] = [el.lon, el.lat]; });
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

  // FIX #1: Wrap handleDistrictSelect in useCallback to stabilize its identity
  const handleDistrictSelect = useCallback((districtName) => {
    setMangroves(null);
    setSelectedDistrict(null);
    setMapMessage("Loading mangrove data...");

    const districtFeature = maharashtraDistrictsGeoJSON.features.find(
      (f) => f.properties.district === districtName
    );

    if (districtFeature) {
      setSelectedDropdownValue(districtName);
      setSelectedDistrict(districtFeature);

      setTimeout(() => {
        if (mapRef.current) {
          const layer = L.geoJSON(districtFeature);
          const bounds = layer.getBounds();
          mapRef.current.fitBounds(bounds);
          fetchMangroves(bounds);
        }
      }, 100);
    }
  }, []); // The empty dependency array means this function is created only once

  // This useEffect hook now safely depends on the memoized handleDistrictSelect function
  useEffect(() => {
    handleDistrictSelect("Mumbai Suburban");
  }, [handleDistrictSelect]); // Add the function to the dependency array

  const mangroveStyle = { color: "green", weight: 2, fillOpacity: 0.6 };

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      <div className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded-lg shadow-lg flex items-center space-x-4">
        <label className="font-semibold">District:</label>
        <select
          value={selectedDropdownValue}
          onChange={(e) => handleDistrictSelect(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="" disabled>-- Choose --</option>
          {maharashtraDistrictsGeoJSON.features
            .map((d) => d.properties.district)
            .sort()
            .map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
        <button
          onClick={() => setMapType(mapType === "osm" ? "satellite" : "osm")}
          className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          {mapType === "osm" ? "Satellite" : "Map"} View
        </button>
      </div>

      {mapMessage && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white p-4 rounded-lg z-[1000] text-center">
          {mapMessage}
        </div>
      )}

      <MapContainer center={[19.7515, 75.7139]} zoom={7} style={{ height: "100%", width: "100%" }} ref={mapRef}>
        {mapType === "osm" ? (
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
         ) : (
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
         )}

        {/* FIX #2: The GeoJSON for the district border has been removed */}
        {/* {selectedDistrict && <GeoJSON key={`geojson-${selectedDropdownValue}`} data={selectedDistrict} style={districtHighlightStyle} />} */}
        
        {mangroves && <GeoJSON data={mangroves} style={mangroveStyle} />}
      </MapContainer>

      <SidePanel district={selectedDistrict} onClose={() => { setSelectedDistrict(null); setSelectedDropdownValue(""); setMangroves(null); setMapMessage(""); }} />
    </div>
  );
}
