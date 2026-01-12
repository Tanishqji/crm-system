import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Save, Search, Filter } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [persons, setPersons] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [formData, setFormData] = useState({
        source: '', status: 'New', expectedRevenue: 0, notes: '', personId: ''
    });

    useEffect(() => {
        fetchLeads();
        fetchPersons();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await axios.get(`${API_URL}/leads`);
            setLeads(res.data);
        } catch (err) {
            console.error("Error fetching leads", err);
        }
    };

    const fetchPersons = async () => {
        try {
            const res = await axios.get(`${API_URL}/persons`);
            setPersons(res.data);
        } catch (err) {
            console.error("Error fetching persons", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingLead) {
                await axios.put(`${API_URL}/leads/${editingLead._id}`, formData);
            } else {
                await axios.post(`${API_URL}/leads`, formData);
            }
            closeModal();
            fetchLeads();
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLead(null);
        setFormData({ source: '', status: 'New', expectedRevenue: 0, notes: '', personId: '' });
    };

    const handleEdit = (lead) => {
        setEditingLead(lead);
        setFormData({
            source: lead.source,
            status: lead.status,
            expectedRevenue: lead.expectedRevenue,
            notes: lead.notes || '',
            personId: lead.personId._id || lead.personId
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            await axios.delete(`${API_URL}/leads/${id}`);
            fetchLeads();
        }
    };

    const filteredLeads = leads.filter(l => {
        const matchesSearch = l.personId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.source.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="page-content">
            <div className="header-actions">
                <h1>Manage <span className="text-gradient">Leads</span></h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Lead
                </button>
            </div>

            <div className="filters-row">
                <div className="search-bar glass-card flex-1">
                    <Search size={18} className="text-muted" />
                    <input
                        type="text"
                        placeholder="Search by person name or source..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-select glass-card">
                    <Filter size={18} className="text-muted" />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="All">All Status</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Lost">Lost</option>
                        <option value="Converted">Converted</option>
                    </select>
                </div>
            </div>

            <div className="table-container glass-card">
                <table>
                    <thead>
                        <tr>
                            <th>Person</th>
                            <th>Source</th>
                            <th>Status</th>
                            <th>Value</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeads.map(lead => (
                            <tr key={lead._id}>
                                <td><strong>{lead.personId?.name || 'Unknown'}</strong></td>
                                <td>{lead.source}</td>
                                <td>
                                    <span className={`status-badge ${lead.status.toLowerCase()}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td>${lead.expectedRevenue}</td>
                                <td className="actions">
                                    <button className="icon-btn edit" onClick={() => handleEdit(lead)}><Edit2 size={16} /></button>
                                    <button className="icon-btn delete" onClick={() => handleDelete(lead._id)}><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card">
                        <div className="modal-header">
                            <h2>{editingLead ? 'Edit Lead' : 'Add New Lead'}</h2>
                            <button className="close-btn" onClick={() => closeModal()}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Person</label>
                                <select required value={formData.personId} onChange={e => setFormData({ ...formData, personId: e.target.value })}>
                                    <option value="">Select Person</option>
                                    {persons.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Source</label>
                                <input required placeholder="e.g. LinkedIn, Referral" value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })} />
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Status</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                        <option value="New">New</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Qualified">Qualified</option>
                                        <option value="Lost">Lost</option>
                                        <option value="Converted">Converted</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Expected Value ($)</label>
                                    <input type="number" value={formData.expectedRevenue} onChange={e => setFormData({ ...formData, expectedRevenue: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Notes</label>
                                <textarea rows="3" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                            </div>
                            <button type="submit" className="btn btn-primary full-width">
                                <Save size={18} /> {editingLead ? 'Update' : 'Save'} Lead
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
        .filters-row { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
        .flex-1 { flex: 1; }
        .filter-select { display: flex; align-items: center; gap: 0.5rem; padding: 0 1rem; }
        .filter-select select { background: transparent; border: none; color: white; outline: none; padding: 0.75rem 0; cursor: pointer; }
        
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
        .status-badge.new { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
        .status-badge.contacted { background: rgba(168, 85, 247, 0.2); color: #a855f7; }
        .status-badge.qualified { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .status-badge.lost { background: rgba(239, 68, 68, 0.2); color: #f87171; }
        .status-badge.converted { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .modal-content select { width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-card); color: white; outline: none; }
        .modal-content select option { background: var(--bg-main); }
      `}</style>
        </div>
    );
};

export default Leads;
