import React from "react";
import Sidebar from "./Sidebar";

const metrics = [
  { id: 1, icon: "fa-cubes", value: "12", label: "Total Containers" },
  { id: 2, icon: "fa-play-circle", value: "8", label: "Running" },
  { id: 3, icon: "fa-layer-group", value: "24", label: "Images" },
  { id: 4, icon: "fa-database", value: "6", label: "Volumes" },
];

const pieData = [
  { label: "Containers", value: 40, color: "#61dafb" },
  { label: "Images",     value: 30, color: "#1d63b8" },
  { label: "Volumes",    value: 20, color: "#27ae60" },
  { label: "Networks",   value: 10, color: "#e74c3c" },
];

const barData = [
  { label: "Jan", value: 65, color: "#61dafb" },
  { label: "Feb", value: 80, color: "#1d63b8" },
  { label: "Mar", value: 45, color: "#27ae60" },
  { label: "Apr", value: 90, color: "#e74c3c" },
  { label: "May", value: 55, color: "#61dafb" },
  { label: "Jun", value: 70, color: "#1d63b8" },
];

const cpuData = [
  { label: "08:00", value: 30 },
  { label: "09:00", value: 55 },
  { label: "10:00", value: 80 },
  { label: "11:00", value: 95 },
  { label: "12:00", value: 65 },
  { label: "13:00", value: 45 },
  { label: "14:00", value: 70 },
];

const networkData = [
  { label: "Mon", value: 20 },
  { label: "Tue", value: 45 },
  { label: "Wed", value: 70 },
  { label: "Thu", value: 85 },
  { label: "Fri", value: 60 },
  { label: "Sat", value: 40 },
  { label: "Sun", value: 55 },
];

const PieChart = () => {
  const cx = 120, cy = 120, r = 100;
  const total = pieData.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = -Math.PI / 2;

  const slices = pieData.map((d) => {
    const sliceAngle = (d.value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    currentAngle = endAngle;

    return { ...d, path };
  });

  return (
    <div className="pie-chart-container">
      <svg width="240" height="240" viewBox="0 0 240 240">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="#0a192f" strokeWidth="2" />
        ))}
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#e6f1ff" fontSize="20" fontWeight="bold">
          {total}
        </text>
      </svg>
      <div className="pie-legend">
        {pieData.map((d, i) => (
          <div key={i} className="pie-legend-item">
            <span className="pie-legend-color" style={{ backgroundColor: d.color }}></span>
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
};

const BarChart = () => {
  const width = 400, height = 220;
  const margin = { top: 20, bottom: 36, left: 40, right: 20 };
  const chartW = width - margin.left - margin.right;
  const chartH = height - margin.top - margin.bottom;
  const maxValue = Math.max(...barData.map((d) => d.value));
  const barWidth = 35;
  const gap = (chartW - barWidth * barData.length) / (barData.length - 1);
  const gridValues = [0, 25, 50, 75];

  return (
    <div className="bar-chart-container">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {gridValues.map((v, i) => {
          const y = margin.top + chartH - (v / maxValue) * chartH;
          return (
            <g key={i}>
              <line x1={margin.left} y1={y} x2={width - margin.right} y2={y}
                stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <text x={margin.left - 8} y={y + 4} textAnchor="end" fill="#8892b0" fontSize="11">
                {v}
              </text>
            </g>
          );
        })}
        {barData.map((d, i) => {
          const barH = (d.value / maxValue) * chartH;
          const x = margin.left + i * (barWidth + gap);
          const y = margin.top + chartH - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={barH} rx="4" fill={d.color} />
              <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fill="#8892b0" fontSize="11">
                {d.value}
              </text>
              <text x={x + barWidth / 2} y={height - 8} textAnchor="middle" fill="#8892b0" fontSize="11">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const LineChart = ({ data, color }) => {
  const width = 400, height = 220;
  const margin = { top: 20, bottom: 36, left: 44, right: 20 };
  const chartW = width - margin.left - margin.right;
  const chartH = height - margin.top - margin.bottom;
  const maxValue = Math.max(...data.map((d) => d.value));
  const gridValues = [0, 25, 50, 75];

  const xScale = (i) => margin.left + (i / (data.length - 1)) * chartW;
  const yScale = (v) => margin.top + chartH - (v / maxValue) * chartH;

  const points = data
    .map((d, i) => {
      const x = xScale(i);
      const y = yScale(d.value);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="line-chart-container">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {gridValues.map((v, i) => {
          const y = yScale(v);
          return (
            <g key={i}>
              <line
                x1={margin.left} y1={y}
                x2={width - margin.right} y2={y}
                stroke="rgba(255,255,255,0.1)" strokeWidth="1"
              />
              <text x={margin.left - 8} y={y + 4} textAnchor="end" fill="#8892b0" fontSize="11">
                {v}
              </text>
            </g>
          );
        })}
        <polyline
          points={points}
          fill="none" stroke={color} strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
        />
        {data.map((d, i) => {
          const x = xScale(i);
          const y = yScale(d.value);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill={color} />
              <text x={x} y={y - 10} textAnchor="middle" fill="#8892b0" fontSize="11">
                {d.value}
              </text>
              <text x={x} y={height - 8} textAnchor="middle" fill="#8892b0" fontSize="11">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="dashboard-content">
        <div className="metrics-grid">
          {metrics.map((m) => (
            <div className="metric-card" key={m.id}>
              <i className={`fa-solid ${m.icon} metric-icon`}></i>
              <span className="metric-value">{m.value}</span>
              <span className="metric-label">{m.label}</span>
            </div>
          ))}
        </div>
        <div className="charts-row">
          <div className="chart-section pie-chart-wrapper">
            <h2>Resource Distribution</h2>
            <PieChart />
          </div>
          <div className="chart-section bar-chart-wrapper">
            <h2>Monthly Activity</h2>
            <BarChart />
          </div>
          <div className="chart-section line-chart-wrapper">
            <h2>CPU Usage</h2>
            <LineChart data={cpuData} color="#61dafb" />
          </div>
          <div className="chart-section line-chart-wrapper">
            <h2>Network Traffic</h2>
            <LineChart data={networkData} color="#27ae60" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
