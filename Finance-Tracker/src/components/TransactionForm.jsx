import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import './TransactionForm.css';

const TransactionForm = ({ onClose, onSubmit, editTransaction }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    useEffect(() => {
        if (editTransaction) {
            setFormData(editTransaction);
        }
    }, [editTransaction]);

    const categories = {
        income: ['Salary', 'Freelance', 'Investment', 'Business', 'Other'],
        expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Other']
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Reset category when type changes
            ...(name === 'type' && { category: '' })
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="transaction-form">
                    <div className="form-group">
                        <label className="label">Transaction Type</label>
                        <div className="type-selector">
                            <button
                                type="button"
                                className={`type-btn ${formData.type === 'income' ? 'active income' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
                            >
                                Income
                            </button>
                            <button
                                type="button"
                                className={`type-btn ${formData.type === 'expense' ? 'active expense' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
                            >
                                Expense
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="input"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Grocery Shopping"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="label" htmlFor="amount">Amount</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                className="input"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="label" htmlFor="date">Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                className="input"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            className="input"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories[formData.type].map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="description">Description (Optional)</label>
                        <textarea
                            id="description"
                            name="description"
                            className="input"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Add any additional notes..."
                            rows="3"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-outline" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <Save size={18} />
                            {editTransaction ? 'Update' : 'Add'} Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;
