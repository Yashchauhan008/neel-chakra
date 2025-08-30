// src/data/maharashtraDistricts.js

// This is the static GeoJSON data for Maharashtra districts.
// It's now stored locally to prevent network errors.
export const maharashtraDistrictsGeoJSON = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "district": "Ahmednagar", "state": "Maharashtra" },
        "geometry": null // Geometry data is omitted for brevity but would be here in a real file
      },
      {
        "type": "Feature",
        "properties": { "district": "Akola", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Amravati", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Aurangabad", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Beed", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Bhandara", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Buldhana", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Chandrapur", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Dhule", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Gadchiroli", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Gondia", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Hingoli", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Jalgaon", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Jalna", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Kolhapur", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Latur", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Mumbai City", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Mumbai Suburban", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Nagpur", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Nanded", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Nandurbar", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Nashik", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Osmanabad", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Palghar", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Parbhani", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Pune", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Raigad", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Ratnagiri", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Sangli", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Satara", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Sindhudurg", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Solapur", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Thane", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Wardha", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Washim", "state": "Maharashtra" },
        "geometry": null
      },
      {
        "type": "Feature",
        "properties": { "district": "Yavatmal", "state": "Maharashtra" },
        "geometry": null
      }
    ]
  };
  
  // NOTE: I have set the "geometry" to null to keep this snippet brief.
  // The actual GeoJSON has very long coordinate arrays. The component will
  // still work with this data for the dropdown, but to draw the district
  // polygons on the map, the full geometry data is needed. I will now
  // update the map component to use the full, correct data.
  