import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, LogOut, User, Wallet } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const navbarHeight = 80; // Approximate navbar height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <button onClick={scrollToTop} className="navbar-brand">
                        <Wallet size={28} />
                        <span>Penny</span>
                    </button>

                    <div className="navbar-links">
                        {currentUser && (
                            <>
                                <button
                                    onClick={() => scrollToSection('dashboard')}
                                    className="nav-link"
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => scrollToSection('transactions')}
                                    className="nav-link"
                                >
                                    Transactions
                                </button>
                            </>
                        )}
                    </div>

                    <div className="navbar-actions">
                        <button
                            className="theme-toggle"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            <Moon size={16} />
                            <Sun size={16} />
                        </button>

                        {currentUser && (
                            <>
                                <div className="user-info">
                                    <User size={18} />
                                    <span>{currentUser.email}</span>
                                </div>
                                <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
