import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Save, Search } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/persons';

const Persons = () => {
    const [persons, setPersons] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPerson, setEditingPerson] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', details: ''
    });

    useEffect(() => {
        fetchPersons();
    }, []);

    const fetchPersons = async () => {
        try {
            const res = await axios.get(API_URL);
            setPersons(res.data);
        } catch (err) {
            console.error("Error fetching persons", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPerson) {
                await axios.put(`${API_URL}/${editingPerson._id}`, formData);
            } else {
                await axios.post(API_URL, formData);
            }
            setIsModalOpen(false);
            setEditingPerson(null);
            setFormData({ name: '', email: '', phone: '', details: '' });
            fetchPersons();
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleEdit = (person) => {
        setEditingPerson(person);
        setFormData({
            name: person.name,
            email: person.email,
            phone: person.phone,
            details: person.details || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            await axios.delete(`${API_URL}/${id}`);
            fetchPersons();
        }
    };

    const filteredPersons = persons.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-content">
            <div className="header-actions">
                <h1>Manage <span className="text-gradient">Persons</span></h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Person
                </button>
            </div>

            <div className="search-bar glass-card">
                <Search size={18} className="text-muted" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="table-container glass-card">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPersons.map(person => (
                            <tr key={person._id}>
                                <td><strong>{person.name}</strong></td>
                                <td>{person.email}</td>
                                <td>{person.phone}</td>
                                <td className="actions">
                                    <button className="icon-btn edit" onClick={() => handleEdit(person)}><Edit2 size={16} /></button>
                                    <button className="icon-btn delete" onClick={() => handleDelete(person._id)}><Trash2 size={16} /></button>
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
                            <h2>{editingPerson ? 'Edit Person' : 'Add New Person'}</h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Notes/Details</label>
                                <textarea rows="3" value={formData.details} onChange={e => setFormData({ ...formData, details: e.target.value })} />
                            </div>
                            <button type="submit" className="btn btn-primary full-width">
                                <Save size={18} /> {editingPerson ? 'Update' : 'Save'} Person
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
        .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .search-bar { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; padding: 0.75rem 1.25rem; }
        .search-bar input { background: transparent; border: none; color: white; width: 100%; outline: none; font-size: 1rem; }
        
        .table-container { padding: 0; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th { padding: 1.25rem; color: var(--text-muted); font-weight: 500; border-bottom: 1px solid var(--border); }
        td { padding: 1.25rem; border-bottom: 1px solid var(--border); }
        tr:last-child td { border-bottom: none; }
        
        .actions { display: flex; gap: 0.75rem; }
        .icon-btn { background: var(--glass); border: 1px solid var(--border); color: var(--text-muted); padding: 0.5rem; border-radius: 8px; cursor: pointer; transition: var(--transition); }
        .icon-btn.edit:hover { background: rgba(99, 102, 241, 0.2); color: #818cf8; border-color: #818cf8; }
        .icon-btn.delete:hover { background: rgba(239, 68, 68, 0.2); color: #f87171; border-color: #f87171; }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
        .modal-content { width: 100%; max-width: 500px; position: relative; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .close-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; }
        
        .form-group { margin-bottom: 1.25rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted); }
        .form-group input, .form-group textarea { width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border); background: var(--glass); color: white; outline: none; }
        .full-width { width: 100%; justify-content: center; margin-top: 1rem; }
      `}</style>
        </div>
    );
};

export default Persons;
