// src/components/SidePanel.js

import React, { useState, useEffect } from 'react';
import { X, Calendar, LineChart as ChartIcon, Leaf } from 'lucide-react';
import L from 'leaflet';
import { format } from 'date-fns';
import DataChart from './DataChart'; // Import our new chart component

// Helper function to get default dates (e.g., past year)
const getPastYearDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return format(date, 'yyyy-MM-dd');
};

const getCurrentDate = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

export default function SidePanel({ district, onClose }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(getPastYearDate());
  const [endDate, setEndDate] = useState(getCurrentDate());

  useEffect(() => {
    if (district) {
      fetchData();
    } else {
      // Clear data when panel is closed
      setData([]);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district]); // Re-fetch when the district changes

  const fetchData = async () => {
    if (!district) return;

    setLoading(true);
    setError(null);

    const layer = L.geoJSON(district);
    const bounds = layer.getBounds();

    const requestBody = {
      min_lon: bounds.getWest(),
      max_lon: bounds.getEast(),
      min_lat: bounds.getSouth(),
      max_lat: bounds.getNorth(),
      start_date: startDate,
      end_date: endDate,
      dataset: "MODIS/006/MOD13Q1" // As specified in your API
    };

    try {
      const response = await fetch('https://neel-chakra-py.onrender.com/get_ndvi_evi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody ),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate metrics from the latest data point
  const getLatestMetrics = () => {
    if (!data || data.length === 0) {
      return { ndvi: 'N/A', evi: 'N/A', co2: 'N/A' };
    }
    const latestData = data[data.length - 1];
    const ndvi = latestData.NDVI;
    const evi = latestData.EVI;

    if (ndvi === null || evi === null) {
      return { ndvi: 'N/A', evi: 'N/A', co2: 'N/A' };
    }

    // Simplified formula from your image
    const biomass = 30 * ndvi + 20 * evi;
    const carbon_storage = biomass * 0.47;
    const co2_equivalent = carbon_storage * 3.67;

    return {
      ndvi: ndvi.toFixed(3),
      evi: evi.toFixed(3),
      co2: co2_equivalent.toFixed(2),
    };
  };

  const metrics = getLatestMetrics();
  const panelClass = district ? 'translate-x-0' : 'translate-x-full';

  return (
    <div
      className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[1000] ${panelClass}`}
    >
      <div className="p-6 h-full flex flex-col">
        {/* --- Header --- */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{district?.properties.district}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        {/* --- Date Range Controls --- */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="w-full bg-teal-600 text-white font-semibold py-2 rounded-md mb-6 hover:bg-teal-700 disabled:bg-gray-400 flex items-center justify-center"
        >
          <Calendar size={18} className="mr-2" />
          {loading ? 'Loading Data...' : 'Apply Date Range'}
        </button>

        {/* --- Main Content Area --- */}
        <div className="flex-grow overflow-y-auto">
          {error && <div className="text-red-500 text-center p-4">Error: {error}</div>}
          
          {/* --- Key Metrics Display --- */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center"><Leaf size={20} className="mr-2 text-green-600"/>Latest Metrics</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <p className="text-sm text-green-800">NDVI</p>
                <p className="text-2xl font-bold text-green-900">{metrics.ndvi}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <p className="text-sm text-blue-800">EVI</p>
                <p className="text-2xl font-bold text-blue-900">{metrics.evi}</p>
              </div>
              <div className="bg-gray-200 p-3 rounded-lg">
                <p className="text-sm text-gray-800">CO₂eq (t/ha)</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.co2}</p>
              </div>
            </div>
          </div>

          {/* --- Chart Display --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center"><ChartIcon size={20} className="mr-2 text-teal-600"/>Vegetation Index Trends</h3>
            <DataChart
              data={data}
              dataKeys={[
                { name: 'NDVI', color: '#2ca02c' }, // green
                { name: 'EVI', color: '#1f77b4' },  // blue
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
