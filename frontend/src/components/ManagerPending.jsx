import React, { useState, useEffect } from 'react';
import { managerAPI } from '../services/api';
import Navbar from './Navbar';
import LeaveList from './LeaveList';

const ManagerPending = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const fetchPendingLeaves = async () => {
    try {
      setLoading(true);
      const response = await managerAPI.getPendingLeaves();
      setPendingLeaves(response.data);
    } catch (error) {
      console.error('Error fetching pending leaves:', error);
    } finally {
      setLoading(false);
    }
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
            <h1>Pending Leave Requests</h1>
            <p className="dashboard-subtitle">
              Review and approve or reject leave requests from your team
            </p>
          </div>

          <div className="card">
            {pendingLeaves.length > 0 ? (
              <LeaveList leaves={pendingLeaves} onUpdate={fetchPendingLeaves} isManager={true} />
            ) : (
              <div className="empty-state">
                <p>No pending leave requests</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerPending;
