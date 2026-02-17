import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { employeeAPI, managerAPI } from '../services/api';
import Navbar from './Navbar';
import LeaveForm from './LeaveForm';
import LeaveList from './LeaveList';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isManager } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (isManager()) {
        const response = await managerAPI.getAllLeaves();
        setLeaves(response.data);
        calculateStats(response.data);
      } else {
        const [leavesResponse, balanceResponse] = await Promise.all([
          employeeAPI.getMyLeaves(),
          employeeAPI.getLeaveBalance(),
        ]);
        setLeaves(leavesResponse.data);
        setLeaveBalance(balanceResponse.data);
        calculateStats(leavesResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (leavesData) => {
    const stats = {
      pending: leavesData.filter((l) => l.status === 'PENDING').length,
      approved: leavesData.filter((l) => l.status === 'APPROVED').length,
      rejected: leavesData.filter((l) => l.status === 'REJECTED').length,
    };
    setStats(stats);
  };

  const handleLeaveApplied = () => {
    setShowLeaveForm(false);
    fetchData();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-header">
            <h1>Welcome, {user?.fullName}!</h1>
            <p className="dashboard-subtitle">
              {isManager() ? 'Manage team leave requests' : 'View and apply for leave'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            {!isManager() && leaveBalance && (
              <div className="stat-card stat-primary">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3>Leave Balance</h3>
                  <p className="stat-value">{leaveBalance.remainingBalance} days</p>
                  <p className="stat-detail">Used: {leaveBalance.usedLeave} days</p>
                </div>
              </div>
            )}

            <div className="stat-card stat-warning">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>Pending</h3>
                <p className="stat-value">{stats.pending}</p>
                <p className="stat-detail">Awaiting approval</p>
              </div>
            </div>

            <div className="stat-card stat-success">
              <div className="stat-icon">✓</div>
              <div className="stat-content">
                <h3>Approved</h3>
                <p className="stat-value">{stats.approved}</p>
                <p className="stat-detail">This year</p>
              </div>
            </div>

            <div className="stat-card stat-danger">
              <div className="stat-icon">✕</div>
              <div className="stat-content">
                <h3>Rejected</h3>
                <p className="stat-value">{stats.rejected}</p>
                <p className="stat-detail">This year</p>
              </div>
            </div>
          </div>

          {/* Apply Leave Button */}
          {!isManager() && (
            <div className="actions-section">
              <button
                className="btn btn-primary"
                onClick={() => setShowLeaveForm(!showLeaveForm)}
              >
                {showLeaveForm ? 'Cancel' : '+ Apply for Leave'}
              </button>
            </div>
          )}

          {/* Leave Application Form */}
          {showLeaveForm && !isManager() && (
            <div className="card">
              <h2 className="card-title">Apply for Leave</h2>
              <LeaveForm onSuccess={handleLeaveApplied} />
            </div>
          )}

          {/* Leave List */}
          <div className="card">
            <h2 className="card-title">
              {isManager() ? 'All Leave Requests' : 'My Leave Requests'}
            </h2>
            <LeaveList leaves={leaves} onUpdate={fetchData} isManager={isManager()} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
