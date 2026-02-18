import React, { useState } from 'react';
import { Edit2, Trash2, Calendar, Tag, FileText } from 'lucide-react';
import './TransactionList.css';

const TransactionList = ({ transactions, onEdit, onDelete, searchTerm, filterType, filterCategory }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || transaction.type === filterType;
        const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;

        return matchesSearch && matchesType && matchesCategory;
    });

    const sortedTransactions = [...filteredTransactions].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );

    if (sortedTransactions.length === 0) {
        return (
            <div className="empty-state">
                <FileText size={64} />
                <h3>No transactions found</h3>
                <p>Start by adding your first transaction</p>
            </div>
        );
    }

    return (
        <div className="transaction-list">
            {sortedTransactions.map((transaction) => (
                <div
                    key={transaction.id}
                    className={`transaction-item ${transaction.type}`}
                >
                    <div className="transaction-main">
                        <div className="transaction-info">
                            <h4 className="transaction-title">{transaction.title}</h4>
                            <div className="transaction-meta">
                                <span className="meta-item">
                                    <Calendar size={14} />
                                    {formatDate(transaction.date)}
                                </span>
                                <span className="meta-item">
                                    <Tag size={14} />
                                    {transaction.category}
                                </span>
                            </div>
                            {transaction.description && (
                                <p className="transaction-description">{transaction.description}</p>
                            )}
                        </div>

                        <div className="transaction-right">
                            <div className={`transaction-amount ${transaction.type}`}>
                                {transaction.type === 'income' ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                            </div>

                            <div className="transaction-actions">
                                <button
                                    className="action-btn edit"
                                    onClick={() => onEdit(transaction)}
                                    title="Edit transaction"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    className="action-btn delete"
                                    onClick={() => onDelete(transaction.id)}
                                    title="Delete transaction"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TransactionList;
