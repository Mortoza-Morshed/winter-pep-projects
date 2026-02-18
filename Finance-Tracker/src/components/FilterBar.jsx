import React from 'react';
import { Search, Filter } from 'lucide-react';
import './FilterBar.css';

const FilterBar = ({
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    transactions
}) => {
    const allCategories = [...new Set(transactions.map(t => t.category))].sort();

    return (
        <div className="filter-bar">
            <div className="search-box">
                <Search size={20} />
                <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="filter-group">
                <div className="filter-item">
                    <Filter size={16} />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>

                <div className="filter-item">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Categories</option>
                        {allCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
