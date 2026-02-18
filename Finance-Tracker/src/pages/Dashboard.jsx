import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot } from 'firebase/firestore';
import { Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import SummaryCards from '../components/SummaryCards';
import FilterBar from '../components/FilterBar';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import Charts from '../components/Charts';
import './Dashboard.css';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editTransaction, setEditTransaction] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    // Fetch transactions from Firestore
    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'transactions'),
            where('userId', '==', currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const transactionsData = [];
            querySnapshot.forEach((doc) => {
                transactionsData.push({ id: doc.id, ...doc.data() });
            });
            setTransactions(transactionsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleAddTransaction = async (formData) => {
        try {
            await addDoc(collection(db, 'transactions'), {
                ...formData,
                userId: currentUser.uid,
                createdAt: new Date().toISOString()
            });
            setShowForm(false);
        } catch (error) {
            console.error('Error adding transaction:', error);
            alert('Failed to add transaction');
        }
    };

    const handleUpdateTransaction = async (formData) => {
        try {
            const transactionRef = doc(db, 'transactions', editTransaction.id);
            await updateDoc(transactionRef, formData);
            setShowForm(false);
            setEditTransaction(null);
        } catch (error) {
            console.error('Error updating transaction:', error);
            alert('Failed to update transaction');
        }
    };

    const handleDeleteTransaction = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await deleteDoc(doc(db, 'transactions', id));
            } catch (error) {
                console.error('Error deleting transaction:', error);
                alert('Failed to delete transaction');
            }
        }
    };

    const handleEdit = (transaction) => {
        setEditTransaction(transaction);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditTransaction(null);
    };

    return (
        <div className="dashboard">
            <Navbar />

            <div className="container dashboard-content">
                <div id="dashboard" className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Financial Dashboard</h1>
                        <p className="dashboard-subtitle">Track your income and expenses</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        <Plus size={20} />
                        Add Transaction
                    </button>
                </div>

                <SummaryCards transactions={transactions} />

                <Charts transactions={transactions} />

                <div id="transactions" className="transactions-section">
                    <h2 className="section-title">Recent Transactions</h2>

                    <FilterBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterType={filterType}
                        setFilterType={setFilterType}
                        filterCategory={filterCategory}
                        setFilterCategory={setFilterCategory}
                        transactions={transactions}
                    />

                    {loading ? (
                        <div className="loading">Loading transactions...</div>
                    ) : (
                        <TransactionList
                            transactions={transactions}
                            onEdit={handleEdit}
                            onDelete={handleDeleteTransaction}
                            searchTerm={searchTerm}
                            filterType={filterType}
                            filterCategory={filterCategory}
                        />
                    )}
                </div>
            </div>

            {showForm && (
                <TransactionForm
                    onClose={handleCloseForm}
                    onSubmit={editTransaction ? handleUpdateTransaction : handleAddTransaction}
                    editTransaction={editTransaction}
                />
            )}
        </div>
    );
};

export default Dashboard;
