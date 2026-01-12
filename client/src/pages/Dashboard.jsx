import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserPlus, CheckCircle, DollarSign } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalLeads: 0,
        totalPersons: 0,
        convertedLeads: 0,
        totalRevenue: 0
    });

    const [leadStatusData, setLeadStatusData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [leadsRes, personsRes] = await Promise.all([
                    axios.get(`${API_URL}/leads`),
                    axios.get(`${API_URL}/persons`)
                ]);

                const leads = leadsRes.data;
                const persons = personsRes.data;

                const converted = leads.filter(l => l.status === 'Converted').length;
                const revenue = leads.reduce((acc, l) => acc + (l.expectedRevenue || 0), 0);

                setStats({
                    totalLeads: leads.length,
                    totalPersons: persons.length,
                    convertedLeads: converted,
                    totalRevenue: revenue
                });

                // Process status distribution
                const statusMap = leads.reduce((acc, l) => {
                    acc[l.status] = (acc[l.status] || 0) + 1;
                    return acc;
                }, {});
                setLeadStatusData(Object.keys(statusMap).map(k => ({ name: k, value: statusMap[k] })));

                // Mock revenue overview (or real if we had dates)
                setRevenueData([
                    { month: 'Jan', revenue: revenue * 0.2 },
                    { month: 'Feb', revenue: revenue * 0.4 },
                    { month: 'Mar', revenue: revenue * 0.6 },
                    { month: 'Apr', revenue: revenue }
                ]);

            } catch (err) {
                console.error("Error fetching dashboard data", err);
            }
        };
        fetchDashboardData();
    }, []);

    const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

    return (
        <div className="dashboard">
            <header className="mb-8">
                <h1 className="text-3xl mb-2">Admin <span className="text-gradient">Dashboard</span></h1>
                <p className="text-muted">Overview of your lead pipeline and performance.</p>
            </header>

            <div className="grid-stats">
                <StatCard title="Total Leads" value={stats.totalLeads} icon={<UserPlus />} color="blue" />
                <StatCard title="Total Persons" value={stats.totalPersons} icon={<Users />} color="purple" />
                <StatCard title="Converted" value={stats.convertedLeads} icon={<CheckCircle />} color="green" />
                <StatCard title="Total Revenue" value={`$${stats.totalRevenue}`} icon={<DollarSign />} color="orange" />
            </div>

            <div className="grid-charts">
                <div className="glass-card chart-container">
                    <h3>Lead Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={leadStatusData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {leadStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass-card chart-container">
                    <h3>Revenue Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
                                itemStyle={{ color: '#f8fafc' }}
                            />
                            <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <style>{`
        .dashboard { padding-top: 1rem; }
        .grid-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .grid-charts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }
        .mb-8 { margin-bottom: 2rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .text-muted { color: var(--text-muted); }
        .text-3xl { font-size: 2rem; }
        .chart-container h3 { margin-bottom: 1.5rem; color: var(--text-muted); font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
      `}</style>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className="glass-card stat-card">
        <div className={`icon-box ${color}`}>{icon}</div>
        <div className="stat-info">
            <p className="text-muted">{title}</p>
            <h2>{value}</h2>
        </div>
        <style>{`
      .stat-card { display: flex; align-items: center; gap: 1.5rem; }
      .icon-box {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }
      .icon-box.blue { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
      .icon-box.purple { background: rgba(168, 85, 247, 0.2); color: #a855f7; }
      .icon-box.green { background: rgba(16, 185, 129, 0.2); color: #10b981; }
      .icon-box.orange { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
      .stat-info h2 { font-size: 1.75rem; margin-top: 0.25rem; }
    `}</style>
    </div>
);

export default Dashboard;
