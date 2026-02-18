import React from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import './SummaryCards.css';

const SummaryCards = ({ transactions }) => {
    const calculateTotals = () => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const balance = income - expense;

        return { income, expense, balance };
    };

    const { income, expense, balance } = calculateTotals();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const cards = [
        {
            title: 'Total Balance',
            amount: balance,
            icon: Wallet,
            gradient: 'gradient-info',
            color: 'info'
        },
        {
            title: 'Total Income',
            amount: income,
            icon: TrendingUp,
            gradient: 'gradient-success',
            color: 'success'
        },
        {
            title: 'Total Expenses',
            amount: expense,
            icon: TrendingDown,
            gradient: 'gradient-danger',
            color: 'danger'
        }
    ];

    return (
        <div className="summary-cards">
            {cards.map((card, index) => (
                <div key={index} className={`summary-card ${card.color}`}>
                    <div className="summary-card-header">
                        <div className={`summary-icon ${card.gradient}`}>
                            <card.icon size={24} />
                        </div>
                        <h3 className="summary-title">{card.title}</h3>
                    </div>
                    <div className="summary-amount">
                        {formatCurrency(card.amount)}
                    </div>
                    <div className="summary-footer">
                        <DollarSign size={16} />
                        <span>Updated just now</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
