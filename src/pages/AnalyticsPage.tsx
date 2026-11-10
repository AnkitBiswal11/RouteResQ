import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingDown,
  Activity,
  FileSpreadsheet,
} from 'lucide-react';
import { useRouteResQ } from '../context/RouteResQContext';

export const AnalyticsPage: React.FC = () => {
  const { t, timelineEvents } = useRouteResQ();
  const [filterPeriod, setFilterPeriod] = useState<'today' | '7days' | '30days'>('today');

  // Response Time Comparison: Static Shortest Path vs RouteResQ Dynamic Network
  const comparisonData = [
    { hour: '06:00', staticMinutes: 24, dynamicMinutes: 14, savedMinutes: 10 },
    { hour: '07:00', staticMinutes: 26, dynamicMinutes: 15, savedMinutes: 11 },
    { hour: '08:00', staticMinutes: 38, dynamicMinutes: 16, savedMinutes: 22 }, // Peak bottleneck without dynamic routing
    { hour: '09:00', staticMinutes: 34, dynamicMinutes: 15, savedMinutes: 19 },
    { hour: '10:00', staticMinutes: 28, dynamicMinutes: 14, savedMinutes: 14 },
    { hour: '11:00', staticMinutes: 25, dynamicMinutes: 13, savedMinutes: 12 },
  ];

  // Rerouting Latency Data
  const latencyData = [
    { event: 'Accident Reported', latencyMs: 240 },
    { event: 'Graph Edge Invalidation', latencyMs: 180 },
    { event: 'A* Recalculation', latencyMs: 310 },
    { event: 'Corridor Signal Sync', latencyMs: 420 },
    { event: 'Telemetry Propagation', latencyMs: 290 },
  ];

  const handleExportCsv = () => {
    const headers = 'Timestamp,IncidentID,RouteTaken,ETA_Minutes,TimeSaved_Minutes,DestinationHospital\n';
    const rows = [
      '2026-11-09 06:30:12,INC-101,Riverfront Ring Road (Priority Green),14,8,Metropolitan Trauma Center',
      '2026-11-09 05:42:00,INC-2026-0889,Direct Arterial Expressway,13,5,Central General Hospital',
      '2026-11-09 04:15:30,INC-2026-0884,West Bypass Avenue,18,6,Metropolitan Trauma Center',
      '2026-11-09 02:50:11,INC-2026-0881,Riverfront Boulevard,15,7,Sanjivani Multispecialty',
    ].join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `routeresq_emergency_analytics_${filterPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-[#2878E8]">
            <BarChart3 className="w-5 h-5 text-[#2878E8]" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#142D4F]">
              Emergency Mobility Analytics & Benchmark Reports
            </h2>
            <p className="text-xs text-slate-500">
              Comparative analysis of static Dijkstra shortest path vs RouteResQ dynamic coordinated response
            </p>
          </div>
        </div>

        {/* Filter and Export CSV */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setFilterPeriod('today')}
              className={`px-3 py-1 rounded-md transition ${
                filterPeriod === 'today' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilterPeriod('7days')}
              className={`px-3 py-1 rounded-md transition ${
                filterPeriod === '7days' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setFilterPeriod('30days')}
              className={`px-3 py-1 rounded-md transition ${
                filterPeriod === '30days' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Last 30 Days
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#2878E8] text-white hover:bg-[#1f66cb] transition shadow-sm cursor-pointer whitespace-nowrap"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{t('exportCsv')}</span>
          </button>
        </div>
      </div>

      {/* 4 Quantitative Top Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Average Travel Time
          </span>
          <div className="text-2xl font-black text-[#142D4F] tabular-nums mt-1">14.6 mins</div>
          <div className="text-xs text-emerald-700 font-bold flex items-center gap-1 mt-1">
            <TrendingDown className="w-3.5 h-3.5" />
            -42% vs Static Routing
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Avg Rerouting Latency
          </span>
          <div className="text-2xl font-black text-[#2878E8] tabular-nums mt-1">320 ms</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Graph Recalculation</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Green Corridor Activations
          </span>
          <div className="text-2xl font-black text-[#13A878] tabular-nums mt-1">18 Today</div>
          <div className="text-xs text-emerald-700 font-medium mt-1">Zero Traffic Incidents</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Fleet Utilization
          </span>
          <div className="text-2xl font-black text-slate-800 tabular-nums mt-1">78.4%</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Metropolitan EMS Fleet</div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart (7 cols): Comparative Response Time */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-[#142D4F]">
                Response Time: Static Routing vs RouteResQ Dynamic Coordination
              </h3>
              <p className="text-xs text-slate-500">
                Simulated emergency runs across metropolitan arterial sectors during variable traffic
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit="m" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#142D4F',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar
                  dataKey="staticMinutes"
                  name="Baseline Static Shortest Path"
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="dynamicMinutes"
                  name="RouteResQ Dynamic Priority Corridor"
                  fill="#13A878"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart (5 cols): Rerouting Engine Latency */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-[#142D4F]">
                Rerouting Engine Latency (ms)
              </h3>
              <p className="text-xs text-slate-500">Time to process disruption and update signals</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="event" stroke="#64748b" fontSize={10} angle={-15} textAnchor="end" height={50} />
                <YAxis stroke="#64748b" fontSize={11} unit="ms" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#142D4F',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="latencyMs"
                  name="Pipeline Latency (ms)"
                  stroke="#2878E8"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#2878E8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
