import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    Cell, Label
} from 'recharts';
import axios from "axios"
import { HOST } from "../../../utils/constants.js"
import { Calendar } from 'lucide-react';

const CATEGORIES = [
    { value: 'leadSource', label: 'Lead Source' },
    { value: 'zodiac', label: 'Zodiac Sign' },
    { value: 'babyGender', label: 'Baby Gender' },
    { value: 'month', label: 'Month' }
];

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4'];

const CustomSelect = ({ value, onChange, options, className = '' }) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className}`}
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        </div>
    </div>
);

const AnalyticsDashboard = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [category, setCategory] = useState('leadSource');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewType, setViewType] = useState('leads');

    useEffect(() => {
        if (!startDate || !endDate) {
            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

            setStartDate(firstDayOfMonth.toISOString().split('T')[0]);
            setEndDate(lastDayOfMonth.toISOString().split('T')[0]);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!startDate || !endDate || !category) return;

            try {
                setLoading(true);
                const res = await axios.get(
                    `${HOST}/api/reports/analytics?startDate=${startDate}&endDate=${endDate}&category=${category}`,
                    { credentials: 'include' }
                );

                const { data, summary } = res.data;
                setData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [startDate, endDate, category]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;

        const data = payload[0].payload;
        const value = viewType === 'leads' ? data.leadCount : data.totalRevenue;
        const total = data.leadCount;
        const paidCount = data.paidLeads;
        const avgRevenue = data.averageRevenue;

        return (
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4">
                <p className="text-lg font-semibold text-gray-800">{data.category}</p>
                <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Leads:</span>
                        <span className="font-medium text-gray-800">{total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Paid Leads:</span>
                        <span className="font-medium text-gray-800">{paidCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Revenue:</span>
                        <span className="font-medium text-gray-800">₹{data.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Avg. Revenue:</span>
                        <span className="font-medium text-gray-800">₹{avgRevenue.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                            <p className="text-gray-500 mt-1">Monitor leads and revenue metrics</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <CustomSelect
                                value={category}
                                onChange={setCategory}
                                options={CATEGORIES}
                                className="w-48"
                            />

                            <CustomSelect
                                value={viewType}
                                onChange={setViewType}
                                options={[
                                    { value: 'leads', label: 'Leads Analysis' },
                                    { value: 'revenue', label: 'Revenue Analysis' }
                                ]}
                                className="w-48"
                            />

                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {viewType === 'leads' ? 'Leads Distribution' : 'Revenue Distribution'} by {
                                CATEGORIES.find(cat => cat.value === category)?.label
                            }
                        </h2>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="h-96 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="category"
                                        tick={{ fill: '#4B5563' }}
                                        axisLine={{ stroke: '#9CA3AF' }}
                                    />
                                    <YAxis
                                        tick={{ fill: '#4B5563' }}
                                        axisLine={{ stroke: '#9CA3AF' }}
                                    >
                                        <Label
                                            angle={-90}
                                            value={viewType === 'leads' ? 'Number of Leads' : 'Revenue (₹)'}
                                            position="insideLeft"
                                            style={{ textAnchor: 'middle', fill: '#4B5563' }}
                                        />
                                    </YAxis>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar
                                        dataKey={viewType === 'leads' ? 'leadCount' : 'totalRevenue'}
                                        name={viewType === 'leads' ? 'Leads' : 'Revenue'}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;