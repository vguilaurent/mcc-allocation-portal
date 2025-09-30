import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SECTORS = [
  'Education',
  'Food Security & Livelihoods',
  'Health',
  'Humanitarian Assistance',
  'Peacebuilding',
];

const DATA = [
  { id: 'PRJ316', name: '500 Years of Anabaptism', country: 'Honduras', fy: 'FY25', budget: 3016, sectors: { Peacebuilding: 1 }, type: 'project' },
  { id: 'PRJ3421', name: 'Improvement of Classrooms (MINED)', country: 'Nicaragua', fy: 'FY25', budget: 53400, sectors: { Education: 1 }, type: 'project' },
];

const TARGETS = {
  Honduras: { Education: 0.02, 'Food Security & Livelihoods': 0.224, Health: 0, 'Humanitarian Assistance': 0.181, Peacebuilding: 0.552 },
  Nicaragua: { Education: 0.149, 'Food Security & Livelihoods': 0.353, Health: 0.203, 'Humanitarian Assistance': 0.09, Peacebuilding: 0.204 },
};

export default function AllocationPortal() {
  const [country, setCountry] = useState('Honduras');
  const [fy, setFY] = useState('FY25');

  const items = useMemo(() => DATA.filter(d => d.country === country && d.fy === fy), [country, fy]);

  const totals = {};
  let grand = 0;
  SECTORS.forEach(s => totals[s] = 0);
  items.forEach(it => {
    grand += it.budget;
    SECTORS.forEach(s => { totals[s] += (it.sectors[s] || 0) * it.budget; });
  });
  const shares = {};
  SECTORS.forEach(s => shares[s] = grand > 0 ? totals[s] / grand : 0);

  const barsData = SECTORS.map(s => ({
    sector: s,
    target: TARGETS[country][s] * 100,
    actual: shares[s] * 100,
  }));

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2>MCC Strategic Allocation Tracker</h2>
      <div>
        <label>Country: </label>
        <select value={country} onChange={e => setCountry(e.target.value)}>
          <option>Honduras</option>
          <option>Nicaragua</option>
        </select>
        <label style={{ marginLeft: 20 }}>FY: </label>
        <select value={fy} onChange={e => setFY(e.target.value)}>
          <option>FY25</option>
        </select>
      </div>
      <h3>Targets vs Actuals ({country}, {fy})</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barsData}>
          <XAxis dataKey="sector" tick={{ fontSize: 10 }} interval={0} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="target" fill="#8884d8" name="Target %" />
          <Bar dataKey="actual" fill="#82ca9d" name="Actual %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
