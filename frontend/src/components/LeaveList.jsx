import React, { useState } from 'react';
import { format } from 'date-fns';
import { employeeAPI, managerAPI } from '../services/api';
import './LeaveList.css';

const LeaveList = ({ leaves, onUpdate, isManager }) => {
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [approvalData, setApprovalData] = useState({
    status: '',
    managerComments: '',
  });
  const [loading, setLoading] = useState(false);

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'badge-warning',
      APPROVED: 'badge-success',
      REJECTED: 'badge-danger',
      CANCELLED: 'badge-gray',
    };
    return `badge ${badges[status] || 'badge-info'}`;
  };

  const formatLeaveType = (type) => {
    return type.replace(/_/g, ' ');
  };

  const handleApprove = (leave) => {
    setSelectedLeave(leave);
    setApprovalData({ status: 'APPROVED', managerComments: '' });
  };

  const handleReject = (leave) => {
    setSelectedLeave(leave);
    setApprovalData({ status: 'REJECTED', managerComments: '' });
  };

  const handleCancelLeave = async (leaveId) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) {
      return;
    }

    try {
      setLoading(true);
      await employeeAPI.cancelLeave(leaveId);
      onUpdate();
    } catch (error) {
      alert('Failed to cancel leave');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApproval = async () => {
    try {
      setLoading(true);
      await managerAPI.approveOrRejectLeave(selectedLeave.id, approvalData);
      setSelectedLeave(null);
      setApprovalData({ status: '', managerComments: '' });
      onUpdate();
    } catch (error) {
      alert('Failed to process leave request');
    } finally {
      setLoading(false);
    }
  };

  if (leaves.length === 0) {
    return (
      <div className="empty-state">
        <p>No leave requests found</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              {isManager && <th>Employee</th>}
              <th>Type</th>
              <th className="md-hidden">Start Date</th>
              <th className="md-hidden">End Date</th>
              <th>Days</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                {isManager && (
                  <td>
                    <div className="employee-info">
                      <strong>{leave.userName}</strong>
                      <small className="md-hidden">{leave.department}</small>
                    </div>
                  </td>
                )}
                <td>{formatLeaveType(leave.leaveType)}</td>
                <td className="md-hidden">{format(new Date(leave.startDate), 'MMM dd, yyyy')}</td>
                <td className="md-hidden">{format(new Date(leave.endDate), 'MMM dd, yyyy')}</td>
                <td>{leave.numberOfDays}</td>
                <td>
                  <span className={getStatusBadge(leave.status)}>{leave.status}</span>
                </td>
                <td>
                  <div className="action-buttons">
                    {isManager && leave.status === 'PENDING' && (
                      <>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleApprove(leave)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleReject(leave)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {!isManager && leave.status === 'PENDING' && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleCancelLeave(leave.id)}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => setSelectedLeave(leave)}
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leave Details Modal */}
      {selectedLeave && (
        <div className="modal-overlay" onClick={() => setSelectedLeave(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Leave Request Details</h2>
              <button className="modal-close" onClick={() => setSelectedLeave(null)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-grid">
                {isManager && (
                  <>
                    <div className="detail-item">
                      <label>Employee</label>
                      <p>{selectedLeave.userName}</p>
                    </div>
                    <div className="detail-item">
                      <label>Department</label>
                      <p>{selectedLeave.department || 'N/A'}</p>
                    </div>
                  </>
                )}
                <div className="detail-item">
                  <label>Leave Type</label>
                  <p>{formatLeaveType(selectedLeave.leaveType)}</p>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <p>
                    <span className={getStatusBadge(selectedLeave.status)}>
                      {selectedLeave.status}
                    </span>
                  </p>
                </div>
                <div className="detail-item">
                  <label>Start Date</label>
                  <p>{format(new Date(selectedLeave.startDate), 'MMMM dd, yyyy')}</p>
                </div>
                <div className="detail-item">
                  <label>End Date</label>
                  <p>{format(new Date(selectedLeave.endDate), 'MMMM dd, yyyy')}</p>
                </div>
                <div className="detail-item">
                  <label>Number of Days</label>
                  <p>{selectedLeave.numberOfDays} days</p>
                </div>
                <div className="detail-item">
                  <label>Applied On</label>
                  <p>{format(new Date(selectedLeave.createdAt), 'MMMM dd, yyyy')}</p>
                </div>
              </div>

              {selectedLeave.reason && (
                <div className="detail-item detail-full">
                  <label>Reason</label>
                  <p>{selectedLeave.reason}</p>
                </div>
              )}

              {selectedLeave.approvedByName && (
                <div className="detail-item detail-full">
                  <label>Approved/Rejected By</label>
                  <p>{selectedLeave.approvedByName}</p>
                </div>
              )}

              {selectedLeave.managerComments && (
                <div className="detail-item detail-full">
                  <label>Manager Comments</label>
                  <p>{selectedLeave.managerComments}</p>
                </div>
              )}

              {/* Approval Form for Managers */}
              {isManager && selectedLeave.status === 'PENDING' && approvalData.status && (
                <div className="approval-form">
                  <h3>
                    {approvalData.status === 'APPROVED' ? 'Approve' : 'Reject'} Leave Request
                  </h3>
                  <div className="form-group">
                    <label className="form-label">Comments (Optional)</label>
                    <textarea
                      className="form-textarea"
                      value={approvalData.managerComments}
                      onChange={(e) =>
                        setApprovalData({ ...approvalData, managerComments: e.target.value })
                      }
                      placeholder="Add your comments here..."
                      rows="3"
                    />
                  </div>
                  <div className="modal-actions">
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        setApprovalData({ status: '', managerComments: '' });
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className={`btn ${
                        approvalData.status === 'APPROVED' ? 'btn-secondary' : 'btn-danger'
                      }`}
                      onClick={handleSubmitApproval}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : `Confirm ${approvalData.status}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaveList;
