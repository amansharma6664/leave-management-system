import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isManager } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <Link to="/dashboard" className="brand-link">
              <span className="brand-icon">📋</span>
              Leave Management
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="navbar-menu desktop-menu">
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            {isManager() && (
              <Link to="/manager/pending" className="nav-link">
                Pending Requests
              </Link>
            )}
            <div className="navbar-user">
              <span className="user-name">{user?.fullName}</span>
              <span className="user-role badge badge-info">
                {user?.roles?.includes('MANAGER') ? 'Manager' : 'Employee'}
              </span>
              <button onClick={handleLogout} className="btn btn-sm btn-outline">
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="navbar-menu mobile-menu">
              <Link
                to="/dashboard"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              {isManager() && (
                <Link
                  to="/manager/pending"
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pending Requests
                </Link>
              )}
              <div className="mobile-user-info">
                <p className="mobile-user-name">{user?.fullName}</p>
                <span className="user-role badge badge-info">
                  {user?.roles?.includes('MANAGER') ? 'Manager' : 'Employee'}
                </span>
                <button onClick={handleLogout} className="btn btn-sm btn-danger mt-2">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
